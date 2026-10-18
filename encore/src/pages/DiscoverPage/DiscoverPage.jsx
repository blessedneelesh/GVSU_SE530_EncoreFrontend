import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useConcerts } from '../../hooks/useConcerts';

export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const { concerts, listStatus, listError, setSearch, retry } = useConcerts();
  const filtered = useMemo(() => concerts, [concerts]);
  function handleSearch(value) {
    setQuery(value);
    setSearch(value);
  }
  return <div className="encore-page"><div className="hero-copy"><h1>Discover concerts</h1><p>There is always something worth showing up for.</p></div><div className="search-row"><input className="dark-input" aria-label="Search concerts" placeholder="Search by concert, category, or city" value={query} onChange={(event) => handleSearch(event.target.value)} /></div>{(listStatus === 'idle' || listStatus === 'loading') && <div className="state-panel" role="status"><h2>Loading concerts</h2><p>Finding live music near you...</p></div>}{listStatus === 'error' && <div className="state-panel" role="alert"><h2>Unable to load concerts</h2><p>{listError}</p><button className="accent-button" type="button" onClick={retry}>Try again</button></div>}{listStatus === 'success' && !filtered.length && <div className="state-panel"><h2>No concerts found</h2><p>Try a different search.</p></div>}{listStatus === 'success' && filtered.length > 0 && <div className="event-grid">{filtered.map((concert) => <article className={`event-card${concert.cancelled ? ' event-card-cancelled' : ''}`} key={concert.id}><EventArtwork concert={concert} /><div className="event-card-body">{concert.cancelled && <p className="status-badge">Cancelled</p>}<p className="event-meta">{concert.date} · {concert.location}</p><h2>{concert.title}</h2><p className="muted">{concert.genre} · {concert.reservedCount}{concert.capacity ? `/${concert.capacity} reserved` : ' reserved'}</p><Link className="accent-button" to={`/events/${concert.id}`}>View concert</Link></div></article>)}</div>}</div>;
}

function EventArtwork({ concert }) {
  return concert.imageUrl
    ? <img className="event-art event-art-image" src={concert.imageUrl} alt="" />
    : <div className="event-art" aria-hidden="true" />;
}
