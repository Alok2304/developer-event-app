import EventCard from "@/components/eventCard";
import Explorebtn from "@/components/explorebtn";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async () => {
  "use cache";
  cacheLife("hours");

  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The HUB for Every Dev <br /> Event You Can't Miss
      </h1>
      <p className="text-center mt-5 ">
        Hackathons, Meetups & Conferences All in One Place
      </p>
      <Explorebtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event) => (
              <li key={event._id || event.title} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
