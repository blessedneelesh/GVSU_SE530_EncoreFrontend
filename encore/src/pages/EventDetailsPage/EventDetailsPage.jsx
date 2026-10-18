import { Link, useParams } from 'react-router-dom';
import { useConcerts } from '../../hooks/useConcerts';

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const { selected: concert, detailStatus, detailError, retry } = useConcerts(eventId);

  if (detailStatus === 'idle' || detailStatus === 'loading') {
    return <div className="state-panel" role="status"><h1>Loading concert</h1><p>Fetching the latest concert details...</p></div>;
  }
  if (detailStatus === 'error') {
    return <div className="state-panel" role="alert"><h1>Unable to load concert</h1><p>{detailError}</p><button className="accent-button" type="button" onClick={retry}>Try again</button></div>;
  }
  if (!concert) {
    return <div className="state-panel"><h1>Concert not found</h1><Link className="outline-button" to="/discover">Back to discover</Link></div>;
  }
  return <article className="event-details"><Link className="muted" to="/discover">← Back to discover</Link>{concert.imageUrl ? <img className="event-art event-art-image" src={concert.imageUrl} alt="" /> : <div className="event-art" aria-hidden="true" />} {concert.cancelled && <p className="status-badge">Cancelled</p>}<p className="event-meta">{concert.date} · {concert.location}</p><h1>{concert.title}</h1><p className="muted">{concert.genre} · {concert.reservedCount}{concert.capacity ? `/${concert.capacity} reserved` : ' reserved'}</p><p>{concert.description}</p><div className="event-actions"><button className="accent-button" type="button" disabled={concert.cancelled}>Reserve a spot</button><Link className="outline-button" to="/dashboard">Save event</Link></div></article>;
}
