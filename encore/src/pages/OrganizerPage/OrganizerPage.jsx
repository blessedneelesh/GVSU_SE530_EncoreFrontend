import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { selectMyShows } from '../../redux/concerts/concerts.selectors';
import { useConcerts } from '../../hooks/useConcerts';

export default function OrganizerPage() {
  const { listStatus, listError, retry } = useConcerts();
  const shows = useAppSelector(selectMyShows);
  const getAvailability = (concert) => {
    const capacity = Number(concert.capacity);
    const reservedCount = Number(concert.reservedCount);
    if (!Number.isFinite(capacity) || capacity <= 0 || !Number.isFinite(reservedCount)) {
      return { label: 'Limited', percentage: 38 };
    }
    const percentage = Math.min(Math.round((reservedCount / capacity) * 100), 100);
    return { label: percentage >= 80 ? 'Almost Full' : 'Limited', percentage };
  };

  return (
    <div className="encore-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Your space</p>
          <h1>My Shows</h1>
          <p className="muted">Manage the shows you posted to Encore.</p>
        </div>
        <Link className="accent-button" to="/post-show">Create show</Link>
      </div>
      {listStatus === 'loading' || listStatus === 'idle' ? <div className="state-panel" role="status"><p>Loading your shows...</p></div> : null}
      {listStatus === 'error' ? <div className="state-panel" role="alert"><p>{listError}</p><button className="accent-button" type="button" onClick={retry}>Try again</button></div> : null}
      {listStatus === 'success' && !shows.length ? <div className="state-panel"><h2>No shows posted yet.</h2><p className="muted">Your published concerts will appear here.</p></div> : null}
      {shows.length > 0 && (
        <>
          <div className="results-heading"><h2>Published shows</h2><span className="muted">{shows.length} {shows.length === 1 ? 'show' : 'shows'}</span></div>
          <div className="reservation-list">
            {shows.map((concert) => {
              const availability = getAvailability(concert);
              return (
                <article className="reservation-row show-row" key={concert.id}>
                  <div className="reservation-row-media">
                    {concert.imageUrl ? <img src={concert.imageUrl} alt="" /> : <div className="event-art" aria-hidden="true" />}
                  </div>
                  <div className="reservation-row-content">
                    <div className="reservation-row-heading">
                      <div>
                        <p className="collection-card-eyebrow">{concert.genre}</p>
                        <h2>{concert.title}</h2>
                      </div>
                      <span className={`reservation-status${concert.cancelled ? ' cancelled' : ''}`}>
                        {concert.cancelled ? 'Cancelled' : 'Published'}
                      </span>
                    </div>
                    <p className="muted">{concert.date} · {concert.location}</p>
                    <div className="reservation-row-bottom">
                      <div className="availability-meter" aria-label={`${availability.label}, ${availability.percentage}% capacity`}>
                        <div className="availability-meter-label">
                          <span>{availability.label}</span>
                          <span>{concert.reservedCount}{concert.capacity ? ` / ${concert.capacity}` : ''} reserved</span>
                        </div>
                        <div className="availability-meter-track">
                          <span style={{ width: `${availability.percentage}%` }} />
                        </div>
                      </div>
                      <Link className="outline-button" to={`/events/${concert.id}`}>Manage show</Link>
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
