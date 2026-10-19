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
  const getAvailability = (reservation) => {
    const capacity = Number(reservation.capacity);
    const reservedCount = Number(reservation.reservedCount);
    if (!Number.isFinite(capacity) || capacity <= 0 || !Number.isFinite(reservedCount)) {
      return { label: 'Limited', percentage: 38 };
    }
    const percentage = Math.min(Math.round((reservedCount / capacity) * 100), 100);
    return { label: percentage >= 80 ? 'Almost Full' : 'Limited', percentage };
  };

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
          <div className="reservation-list">
            {reservations.map((reservation, index) => {
              const availability = getAvailability(reservation);
              return (
                <article className="reservation-row" key={reservation.id ?? `${reservation.concertId}-${index}`}>
                  <div className="reservation-row-media">
                    {reservation.imageUrl ? <img src={reservation.imageUrl} alt="" /> : <div className="event-art" aria-hidden="true" />}
                  </div>
                  <div className="reservation-row-content">
                    <div className="reservation-row-heading">
                      <div>
                        <p className="collection-card-eyebrow">{reservation.genre}</p>
                        <h2>{reservation.title}</h2>
                      </div>
                      <span className="reservation-status">{reservation.cancelled ? 'Cancelled' : 'Reserved'}</span>
                    </div>
                    <p className="muted">{reservation.date ?? 'Date to be announced'} · {reservation.location || reservation.venue || 'Location to be announced'}</p>
                    <div className="reservation-row-bottom">
                      <div className="availability-meter" aria-label={`${availability.label}, ${availability.percentage}% capacity`}>
                        <div className="availability-meter-label"><span>{availability.label}</span><span>{reservation.seats} {reservation.seats === 1 ? 'seat' : 'seats'} reserved</span></div>
                        <div className="availability-meter-track"><span style={{ width: `${availability.percentage}%` }} /></div>
                      </div>
                      <Link className="outline-button" to={`/events/${reservation.concertId}`}>View show</Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
