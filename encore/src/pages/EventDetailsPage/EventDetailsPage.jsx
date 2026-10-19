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
    comment,
    commentStatus,
    commentError,
    commentsStatus,
    attendees,
    attendeesStatus,
    attendeesError,
  } = useConcerts(eventId);
  const [imageFailed, setImageFailed] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [seatCount, setSeatCount] = useState(1);
  const [commentText, setCommentText] = useState('');
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
  const comments = Array.isArray(concert.comments) ? concert.comments : [];
  const commentCount = comments.length;
  const hasCommentText = commentText.trim().length > 0;

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
                <form className="reservation-form" onSubmit={(event) => { event.preventDefault(); reserve({ seats: seatCount }); }}>
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
            ['comments', `Comments (${commentCount})`],
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
          <div className={`event-tab-panel${attendeesStatus === 'success' && attendees.length === 0 ? ' attendees-empty-panel' : ''}`} id="attendees-panel" role="tabpanel" aria-labelledby="attendees-tab" tabIndex="0">
            {attendeesStatus === 'loading' ? <p className="muted" role="status">Loading attendees...</p> : null}
            {attendeesStatus === 'error' ? <p className="form-error" role="alert">{attendeesError}</p> : null}
            {attendeesStatus === 'success' && attendees.length === 0 ? (
              <p className="muted">No attendees yet. Be the first to reserve.</p>
            ) : null}
            {attendees.length > 0 && (
              <div className="attendee-list" aria-label="Attendees who booked tickets">
                {attendees.map((attendee) => (
                  <div className="attendee-row" key={attendee.id ?? attendee.name}>
                    <span className="attendee-avatar" aria-hidden="true">{attendee.name.charAt(0).toUpperCase()}</span>
                    <strong>{attendee.name.charAt(0).toUpperCase() + attendee.name.slice(1)}</strong>
                    <span className="muted">{attendee.seats} {attendee.seats === 1 ? 'seat' : 'seats'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === 'comments' && (
          <div className="event-tab-panel comments-panel" id="comments-panel" role="tabpanel" aria-labelledby="comments-tab" tabIndex="0">
            <p className="eyebrow">Community</p>
            <h2>Join the conversation.</h2>
            {commentsStatus === 'loading' ? (
              <p className="muted comments-empty" role="status">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="muted comments-empty">no comments yet. Start the converation</p>
            ) : (
              <div className="comments-list" aria-label="Show comments">
                {comments.map((item, index) => {
                  const text = typeof item === 'string'
                    ? item
                    : item.text ?? item.comment ?? item.content ?? item.body ?? '';
                  return (
                    <article className="comment-card" key={item.id ?? `${text}-${index}`}>
                      <div className="comment-card-heading">
                        <strong>{item.username ?? item.author_name ?? item.authorName ?? item.user?.name ?? 'Encore guest'}</strong>
                        {item.created_at && <time dateTime={item.created_at}>{new Date(item.created_at).toLocaleDateString()}</time>}
                      </div>
                      <p>{text}</p>
                    </article>
                  );
                })}
              </div>
            )}
            <form className="comment-form" onSubmit={(event) => {
              event.preventDefault();
              const value = commentText.trim();
              if (value && commentStatus !== 'loading') {
                comment(value);
                setCommentText('');
              }
            }}>
              <label htmlFor="show-comment">Share your thoughts</label>
              <textarea
                id="show-comment"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a comment..."
                rows="4"
                maxLength="1000"
                disabled={commentStatus === 'loading'}
              />
              {commentError && <p className="form-error" role="alert">{commentError}</p>}
              <div className="comment-form-footer">
                <span>{commentText.length}/1000</span>
                <button className="accent-button" type="submit" disabled={!hasCommentText || commentStatus === 'loading'}>
                  {commentStatus === 'loading' ? 'Posting...' : 'Post comment'}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>
    </article>
  );
}
