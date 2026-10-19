import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useConcerts } from '../../hooks/useConcerts';

export default function ReservationsPage() {
  const {
    reservations,
    reservationsStatus,
    reservationsError,
    loadReservations,
  } = useConcerts();

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return (
    <div className="encore-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Your plans</p>
          <h1>My Reservations</h1>
          <p className="muted">Keep track of the shows you are attending.</p>
        </div>
        <Link className="accent-button" to="/discover">Discover shows</Link>
      </div>
      {reservationsStatus === 'loading' || reservationsStatus === 'idle' ? (
        <div className="state-panel" role="status"><p>Loading your reservations...</p></div>
      ) : null}
      {reservationsStatus === 'error' ? (
        <div className="state-panel" role="alert">
          <p>{reservationsError}</p>
          <button className="accent-button" type="button" onClick={loadReservations}>Try again</button>
        </div>
      ) : null}
      {reservationsStatus === 'success' && !reservations.length ? (
        <div className="state-panel">
          <h2>No reservations yet.</h2>
          <p className="muted">Reserve a spot at a show and it will appear here.</p>
          <Link className="outline-button" to="/discover">Find a show</Link>
        </div>
      ) : null}
      {reservations.length > 0 && (
        <>
          <div className="results-heading">
            <h2>Upcoming shows</h2>
            <span className="muted">{reservations.length} {reservations.length === 1 ? 'reservation' : 'reservations'}</span>
          </div>
          <div className="event-grid">
            {reservations.map((reservation, index) => (
              <article className="event-card" key={reservation.id ?? `${reservation.concertId}-${index}`}>
                {reservation.imageUrl ? <img className="event-art event-art-image" src={reservation.imageUrl} alt="" /> : <div className="event-art" aria-hidden="true" />}
                <div className="event-card-body">
                  <p className="event-meta">{reservation.date ?? 'Date to be announced'}</p>
                  <h2>{reservation.title}</h2>
                  <p className="muted">{reservation.location || reservation.venue || 'Location to be announced'}</p>
                  <p className="muted">{reservation.seats} {reservation.seats === 1 ? 'seat' : 'seats'} reserved</p>
                  <Link className="outline-button" to={`/events/${reservation.concertId}`}>View show</Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
