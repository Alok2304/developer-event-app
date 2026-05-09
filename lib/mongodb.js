import mongoose from "mongoose";
// Source - https://stackoverflow.com/a/79892633
// Posted by Xoosk
// Retrieved 2026-05-05, License - CC BY-SA 4.0

import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

/**
 * Global cache for Mongoose connection to prevent multiple connections
 * during development hot reloads in Next.js
 */
const globalWithMongoose = global;

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

/**
 * Establishes and caches a connection to MongoDB using Mongoose.
 * This function ensures that only one connection is made and reused,
 * which is crucial for performance and to avoid connection limits.
 *
 * @returns {Promise<typeof mongoose>} Promise resolving to the Mongoose instance
 * @throws {Error} If MONGODB_URI environment variable is not defined or connection fails
 */
async function connectDB() {
  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise is already in progress, wait for it
  if (!cached.promise) {
    // Trim the MONGODB_URI to handle potential spaces from .env file parsing
    let MONGODB_URI = process.env.MONGODB_URI?.trim();

    // Validate that the MongoDB URI is provided
    if (!MONGODB_URI) {
      throw new Error(
        "Please define the MONGODB_URI environment variable in your .env.local file",
      );
    }

    // Connection options for optimal performance and reliability
    const options = {
      bufferCommands: false, // Disable Mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Increased timeout for SRV record lookup
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true, // Enable automatic retry on write
    };

    // Create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      console.log("✓ MongoDB connected successfully");
      return mongoose;
    });
  }

  try {
    // Await the connection promise
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise on error to allow retry on next request
    cached.promise = null;

    console.error("✗ MongoDB connection error:", error.message);

    // Provide diagnostic information based on error type
    if (error.code === "ECONNREFUSED" || error.message.includes("querySrv")) {
      console.error(
        "→ Network Issue: Unable to reach MongoDB. Possible causes:",
      );
      console.error("  • No internet connection");
      console.error("  • DNS/network configuration issues");
      console.error("  • MongoDB Atlas cluster temporarily unavailable");
      console.error("  • Firewall blocking database access");
    } else if (error.message.includes("authentication failed")) {
      console.error(
        "→ Authentication Issue: Check your MongoDB credentials in .env.local",
      );
    } else if (error.message.includes("not found")) {
      console.error(
        "→ Connection String Issue: Verify the MongoDB cluster exists",
      );
    }

    // Log sanitized connection string for debugging (hide password)
    const MONGODB_URI = process.env.MONGODB_URI?.trim();
    if (MONGODB_URI) {
      const sanitizedUri = MONGODB_URI.replace(
        /:([^:@]{4})[^:@]*@/,
        ":$1****@",
      );
      console.error("→ Connection string:", sanitizedUri);
    }

    throw error;
  }

  return cached.conn;
}

export default connectDB;
