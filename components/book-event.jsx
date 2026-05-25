"use client";

import { useState } from "react";

const handleSubmit = (e) => {
  e.preventDefault();

  setTimeout(() => {
    setSubmitted(true);
  })
};

const BookEvent = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">
          Join {bookings} others in booking your spot for this event.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              value={email}
              id="email"
              placeholder="Enter your Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
