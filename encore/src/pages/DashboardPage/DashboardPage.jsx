import { Link } from 'react-router-dom';
import { useConcerts } from '../../hooks/useConcerts';

export default function DashboardPage() {
  const { concerts, listStatus, listError, retry } = useConcerts();
  return (
    <div className="encore-page">
      <section className="hero-copy">
        <p className="muted">Good evening, Alex</p>
        <h1>Find your next unforgettable night.</h1>
        <p>Discover live music, comedy, art, and community events happening around you.</p>
        <Link className="accent-button" to="/discover">Explore events</Link>
      </section>
      <div className="page-header"><div><h2>Upcoming for you</h2><p className="muted">Handpicked events based on your interests</p></div><Link className="outline-button" to="/discover">View all</Link></div>
      {listStatus === 'loading' || listStatus === 'idle' ? <div className="state-panel" role="status"><p>Loading your concerts...</p></div> : null}
      {listStatus === 'error' ? <div className="state-panel" role="alert"><p>{listError}</p><button className="accent-button" type="button" onClick={retry}>Try again</button></div> : null}
      {listStatus === 'success' && !concerts.length ? <div className="state-panel"><p>No upcoming concerts yet.</p></div> : null}
      {listStatus === 'success' && concerts.length > 0 ? <div className="event-grid">{concerts.slice(0, 3).map((concert) => <EventPreview key={concert.id} event={concert} />)}</div> : null}
    </div>
  );
}

function EventPreview({ event }) {
  return <article className="event-card">{event.imageUrl ? <img className="event-art event-art-image" src={event.imageUrl} alt="" /> : <div className="event-art" aria-hidden="true" />}<div className="event-card-body">{event.cancelled && <p className="status-badge">Cancelled</p>}<p className="event-meta">{event.date} · {event.location}</p><h2>{event.title}</h2><p className="muted">{event.genre} · {event.reservedCount}{event.capacity ? `/${event.capacity} reserved` : ' reserved'}</p><Link className="outline-button" to={`/events/${event.id}`}>View concert</Link></div></article>;
}
