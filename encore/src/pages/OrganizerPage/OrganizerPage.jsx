import { Link } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { selectMyShows } from '../../redux/concerts/concerts.selectors';
import { useConcerts } from '../../hooks/useConcerts';

export default function OrganizerPage() {
  const { listStatus, listError, retry } = useConcerts();
  const shows = useAppSelector(selectMyShows);

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
          <div className="event-grid">
            {shows.map((concert) => (
              <article className="event-card collection-card show-owner-card" key={concert.id}>
                <div className="collection-card-media">
                  {concert.imageUrl ? <img className="event-art event-art-image" src={concert.imageUrl} alt="" /> : <div className="event-art" aria-hidden="true" />}
                  <span className="collection-card-label">Published</span>
                </div>
                <div className="event-card-body collection-card-body">
                  {concert.cancelled && <p className="status-badge">Cancelled</p>}
                  <p className="collection-card-eyebrow">{concert.genre}</p>
                  <h2>{concert.title}</h2>
                  <p className="muted">{concert.date}</p>
                  <p className="collection-card-location">{concert.location}</p>
                  <div className="collection-card-footer">
                    <span>{concert.reservedCount}{concert.capacity ? ` / ${concert.capacity}` : ''} reserved</span>
                    <Link className="outline-button" to={`/events/${concert.id}`}>Manage show</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
