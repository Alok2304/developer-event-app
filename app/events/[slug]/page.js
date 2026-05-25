import BookEvent from "@/components/book-event";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItems = ({ icon, alt, label }) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => {
        return <li key={item}>{item}</li>;
      })}
    </ul>
  </div>
);

const EventTags = ({ tags }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => {
      return (
        <div className="pill" key={tag}>
          {tag}
        </div>
      );
    })}
  </div>
);

const EventDetailsPage = async ({ params }) => {
  const { slug } = await params;

  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const {
    event: {
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
      organizer,
      tags,
    },
  } = await request.json();

  if (!description) {
    return notFound();
  }

  const bookings = 10;

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>
      <div className="details">
        <div className="content">
          <Image
            src={image}
            alt="Event"
            width={400}
            height={400}
            className="banner"
            loading="eager"
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItems
              icon="/icons/calendar.svg"
              alt="Date"
              label={date}
            />
            <EventDetailItems icon="/icons/clock.svg" alt="Time" label={time} />
            <EventDetailItems
              icon="/icons/pin.svg"
              alt="Pin"
              label={location}
            />
            <EventDetailItems icon="/icons/mode.svg" alt="Mode" label={mode} />
            <EventDetailItems
              icon="/icons/audience.svg"
              alt="Audience"
              label={audience}
            />
          </section>
          <EventAgenda agendaItems={JSON.parse(agenda[0])} />
          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={JSON.parse(tags[0])} />
        </div>
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} others in booking your spot for this event.
              </p>
            ) : (
              <p className="text-sm">
                Be the first to book your spot for this event.
              </p>
            )}
            <BookEvent />
          </div>
        </aside>
      </div>
    </section>
  );
};

export default EventDetailsPage;
