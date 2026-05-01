import EventCard from "@/components/eventCard";
import Explorebtn from "@/components/explorebtn";
import { events } from "@/lib/constants";

const Home = () => {
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
          {events.map(event => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Home;
