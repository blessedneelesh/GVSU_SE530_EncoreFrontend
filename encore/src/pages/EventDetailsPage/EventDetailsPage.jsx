import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useConcerts } from '../../hooks/useConcerts';

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const {
    selected: concert,
    detailStatus,
    detailError,
    retry,
    reserve,
    reservationStatus,
    reservationError,
    resetReservation,
  } = useConcerts(eventId);
  const [imageFailed, setImageFailed] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [seatCount, setSeatCount] = useState(1);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isReservationOpen) return undefined;
    closeButtonRef.current?.focus();
    const handleEscape = (event) => {
      if (event.key === 'Escape' && reservationStatus !== 'loading') setIsReservationOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isReservationOpen, reservationStatus]);

  if (detailStatus === 'idle' || detailStatus === 'loading') {
    return <div className="state-panel" role="status" aria-live="polite"><p className="eyebrow">Encore events</p><h1>Loading concert</h1><p>Fetching the latest concert details...</p></div>;
  }
  if (detailStatus === 'error') {
    return <div className="state-panel" role="alert"><p className="eyebrow">Encore events</p><h1>Unable to load concert</h1><p>{detailError}</p><div className="event-actions event-actions-centered"><button className="accent-button" type="button" onClick={retry}>Try again</button><Link className="outline-button" to="/discover">Back to discover</Link></div></div>;
  }
  if (!concert) {
    return <div className="state-panel"><h1>Concert not found</h1><Link className="outline-button" to="/discover">Back to discover</Link></div>;
  }
  const remainingSpots = concert.capacity === null ? null : Math.max(concert.capacity - concert.reservedCount, 0);
  const availability = concert.capacity === null
    ? 'Capacity information unavailable'
    : `${concert.reservedCount} of ${concert.capacity} spots reserved`;

  return (
    <article className="event-details">
      <Link className="back-link" to="/discover">← Back to discover</Link>
      <section className="event-hero" aria-labelledby="concert-title">
        <div className="event-hero-art">
          {concert.imageUrl && !imageFailed
            ? <img className="event-art-image" src={concert.imageUrl} alt="" onError={() => setImageFailed(true)} />
            : <div className="event-art" aria-hidden="true" />}
          <span className="event-genre">{concert.genre}</span>
        </div>
        <div className="event-hero-copy">
          {concert.cancelled && <p className="status-badge">Cancelled</p>}
          <p className="eyebrow">Live at Encore</p>
          <h1 id="concert-title">{concert.title}</h1>
          <p className="event-lede">{concert.description}</p>
          <div className="event-facts">
            <div><span className="fact-label">When</span><strong>{concert.date}</strong></div>
            <div><span className="fact-label">Where</span><strong>{concert.location}</strong></div>
          </div>
        </div>
      </section>
      <section className="event-booking-panel" aria-label="Concert availability">
        <div>
          <p className="eyebrow">Make it a night out</p>
          <h2>Reserve your spot</h2>
          <p className="muted">{availability}</p>
        </div>
        <div className="availability-count">
          <strong>{remainingSpots === null ? '—' : remainingSpots}</strong>
          <span>spots left</span>
        </div>
        <div className="event-actions">
          <button className="accent-button" type="button" disabled={concert.cancelled || remainingSpots === 0} onClick={() => { resetReservation(); setSeatCount(1); setIsReservationOpen(true); }}>
            {concert.cancelled ? 'Reservations closed' : remainingSpots === 0 ? 'Sold out' : 'Reserve a spot'}
          </button>
          <Link className="outline-button" to="/organizer">View my events</Link>
        </div>
      </section>
      {isReservationOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && reservationStatus !== 'loading') setIsReservationOpen(false); }}>
          <section className="reservation-modal" role="dialog" aria-modal="true" aria-labelledby="reservation-title">
            <button className="modal-close" ref={closeButtonRef} type="button" aria-label="Close reservation form" disabled={reservationStatus === 'loading'} onClick={() => setIsReservationOpen(false)}>×</button>
            {reservationStatus === 'success' ? (
              <div className="reservation-success" role="status">
                <p className="eyebrow">You’re on the list</p>
                <h2 id="reservation-title">Reservation confirmed.</h2>
                <p className="muted">Your spot for {concert.title} is reserved. We’ll see you there.</p>
                <button className="accent-button" type="button" onClick={() => setIsReservationOpen(false)}>Done</button>
              </div>
            ) : (
              <>
                <div className="reservation-heading">
                  <div>
                    <p className="eyebrow">Reserve your spot</p>
                    <h2 id="reservation-title">Reserve seats</h2>
                  </div>
                  <span className="reservation-mark" aria-hidden="true">✦</span>
                </div>
                <div className="reservation-event-summary">
                  <strong>{concert.title}</strong>
                  <span>{concert.date}</span>
                  <span>{concert.location}</span>
                </div>
                {reservationError && <p className="form-error" role="alert">{reservationError}</p>}
                <form className="reservation-form" onSubmit={(event) => { event.preventDefault(); reserve({ quantity: seatCount }); }}>
                  <fieldset className="seat-selection">
                    <legend>How many seats?</legend>
                    <div className="seat-options">
                      {[1, 2, 3, 4].map((count) => (
                        <button
                          className={`seat-option${seatCount === count ? ' selected' : ''}`}
                          key={count}
                          type="button"
                          disabled={remainingSpots !== null && count > Math.min(remainingSpots, 4)}
                          aria-pressed={seatCount === count}
                          onClick={() => setSeatCount(count)}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                    <p className="seat-availability">{remainingSpots === null ? 'Availability information unavailable' : `${remainingSpots} seats available · max 4 per reservation`}</p>
                  </fieldset>
                  <div className="reservation-actions">
                    <button className="outline-button" type="button" disabled={reservationStatus === 'loading'} onClick={() => setIsReservationOpen(false)}>Cancel</button>
                    <button className="accent-button" type="submit" disabled={reservationStatus === 'loading'}>
                      {reservationStatus === 'loading' ? 'Reserving...' : `Confirm ${seatCount} seat${seatCount === 1 ? '' : 's'}`}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      )}
      <section className="event-information" aria-label="Concert information">
        <div className="event-tabs" role="tablist" aria-label="Concert details">
          {[
            ['about', 'About'],
            ['attendees', 'Attendees'],
            ['comments', 'Comments'],
          ].map(([tabId, label]) => (
            <button
              className={`event-tab${activeTab === tabId ? ' active' : ''}`}
              id={`${tabId}-tab`}
              key={tabId}
              role="tab"
              aria-controls={`${tabId}-panel`}
              aria-selected={activeTab === tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
            >
              {label}
            </button>
          ))}
        </div>
        {activeTab === 'about' && (
          <div className="event-description" id="about-panel" role="tabpanel" aria-labelledby="about-tab" tabIndex="0">
            <p className="eyebrow">About this event</p>
            <h2>Good times are better shared.</h2>
            <p>{concert.description}</p>
          </div>
        )}
        {activeTab === 'attendees' && (
          <div className="event-tab-panel" id="attendees-panel" role="tabpanel" aria-labelledby="attendees-tab" tabIndex="0">
            <p className="eyebrow">The crowd</p>
            <h2>Join the audience.</h2>
            <p className="muted">
              {concert.reservedCount === 0
                ? 'Be the first to reserve a spot for this event.'
                : `${concert.reservedCount} ${concert.reservedCount === 1 ? 'person has' : 'people have'} reserved a spot.`}
            </p>
            <div className="attendee-summary">
              <strong>{concert.reservedCount}</strong>
              <span>registered attendees</span>
            </div>
            <p className="muted attendee-note">Attendee profiles will appear here when attendee details are available.</p>
          </div>
        )}
        {activeTab === 'comments' && (
          <div className="event-tab-panel event-empty-panel" id="comments-panel" role="tabpanel" aria-labelledby="comments-tab" tabIndex="0">
            <p className="eyebrow">Community</p>
            <h2>No comments yet.</h2>
            <p className="muted">Be the first to share what you are looking forward to.</p>
            <button className="outline-button" type="button" disabled>Comments coming soon</button>
          </div>
        )}
      </section>
    </article>
  );
}
