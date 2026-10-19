import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useConcerts } from '../../hooks/useConcerts';

export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const { concerts, genre, listStatus, listError, setGenre, setSearch, retry } = useConcerts();
  const concertTypes = useMemo(() => ['All', ...new Set(concerts.map((concert) => concert.genre).filter(Boolean))], [concerts]);
  function handleSearch(value) {
    setQuery(value);
    setSearch(value);
  }
  const filtered = useMemo(() => concerts, [concerts]);

  return (
    <div className="encore-page">
      <div className="hero-copy">
        <p className="eyebrow">Encore events</p>
        <h1>Discover your next night out.</h1>
        <p>Find live music, comedy, and unforgettable experiences happening around you.</p>
      </div>
      <div className="discover-toolbar">
        <label className="search-field">
          <span className="sr-only">Search concerts</span>
          <input
            className="dark-input"
            aria-label="Search concerts"
            placeholder="Search concerts, genres, or locations"
            value={query}
            onChange={(event) => handleSearch(event.target.value)}
          />
        </label>
        <div className="genre-filters" aria-label="Filter by concert type">
          {concertTypes.map((type) => (
            <button
              className={`filter-chip${genre === type ? ' selected' : ''}`}
              type="button"
              key={type}
              onClick={() => setGenre(type)}
              aria-pressed={genre === type}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      {(listStatus === 'idle' || listStatus === 'loading') && (
        <div className="state-panel" role="status">
          <h2>Loading concerts</h2>
          <p>Finding live music near you...</p>
        </div>
      )}
      {listStatus === 'error' && (
        <div className="state-panel" role="alert">
          <h2>Unable to load concerts</h2>
          <p>{listError}</p>
          <button className="accent-button" type="button" onClick={retry}>
            Try again
          </button>
        </div>
      )}
      {listStatus === 'success' && !filtered.length && (
        <div className="state-panel">
          <h2>No concerts found</h2>
          <p>Try a different search or concert type.</p>
        </div>
      )}
      {listStatus === 'success' && filtered.length > 0 && (
        <>
          <div className="results-heading">
            <h2>All concerts</h2>
            <span className="muted">{filtered.length} available</span>
          </div>
          <div className="event-grid">
            {filtered.map((concert) => {
              const moodTheme = concert.moodTheme || {
                label: concert.mood || 'Happy',
                color: '#facc15',
                bg: 'rgba(250, 204, 21, 0.14)',
                border: '#eab308',
              };
              return (
                <article
                  className={`event-card${concert.cancelled ? ' event-card-cancelled' : ''}`}
                  key={concert.id}
                  style={{ borderTop: `4px solid ${moodTheme.border}` }}
                >
                  <EventArtwork concert={concert} />
                  <div className="event-card-body">
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                      {concert.cancelled && <p className="status-badge" style={{ margin: 0 }}>Cancelled</p>}
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 9px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: moodTheme.color,
                          background: moodTheme.bg,
                          border: `1px solid ${moodTheme.border}`,
                        }}
                      >
                        {moodTheme.label}
                      </span>
                    </div>
                    <p className="event-meta">
                      {concert.date} · {concert.location}
                    </p>
                    <h2>{concert.title}</h2>
                    <p className="muted">
                      {concert.genre} · {concert.reservedCount}
                      {concert.capacity ? `/${concert.capacity} reserved` : ' reserved'}
                    </p>
                    <Link className="accent-button" to={`/events/${concert.id}`}>
                      View concert
                    </Link>
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

function EventArtwork({ concert }) {
  return concert.imageUrl
    ? <img className="event-art event-art-image" src={concert.imageUrl} alt="" />
    : <div className="event-art" aria-hidden="true" />;
}