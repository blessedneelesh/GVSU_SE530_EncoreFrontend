export const MOOD_THEMES = {
  Happy: {
    label: 'Happy',
    color: '#facc15', // Yellow
    bg: 'rgba(250, 204, 21, 0.14)',
    border: '#eab308',
  },
  Sad: {
    label: 'Sad',
    color: '#38bdf8', // Blue
    bg: 'rgba(56, 189, 248, 0.14)',
    border: '#2563eb',
  },
  Angry: {
    label: 'Angry',
    color: '#f87171', // Red
    bg: 'rgba(248, 113, 113, 0.14)',
    border: '#dc2626',
  },
};

export function mapConcert(concert) {
  const source = concert?.data ?? concert;
  const rawDateStr = source.date ? String(source.date).split('T')[0] : null;
  const date = rawDateStr ? new Date(`${rawDateStr}T${source.time || '00:00:00'}`) : null;
  const mood = source.mood || 'Happy';

  return {
    ...source,
    id: String(source.id ?? source.concertId),
    ownerId: String(source.owner_id ?? source.ownerId ?? source.organizerId ?? ''),
    title: source.title ?? source.name ?? 'Untitled concert',
    category: source.category ?? source.genre ?? 'Live music',
    genre: source.genre ?? source.category ?? 'Live music',
    mood,
    moodTheme: MOOD_THEMES[mood] || MOOD_THEMES.Happy,
    date: date && !Number.isNaN(date.getTime())
      ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
      : source.date ?? source.startDate ?? 'Date to be announced',
    location: source.location ?? ([source.venue, source.city, source.state].filter(Boolean).join(', ') || 'Location to be announced'),
    description: source.description ?? 'No description is available for this concert.',
    imageUrl: source.imageUrl ?? source.image_url ?? '',
    capacity: Number.isFinite(source.capacity) ? source.capacity : null,
    reservedCount: Number.isFinite(source.reservedCount) ? source.reservedCount : (Number.isFinite(source.reserved_count) ? source.reserved_count : 0),
    cancelled: Boolean(source.cancelled),
    comments: Array.isArray(source.comments) ? source.comments : [],
  };
}

export function mapConcertCollection(response) {
  const items = Array.isArray(response)
    ? response
    : response?.items ?? response?.concerts ?? response?.data ?? [];
  return Array.isArray(items) ? items.map(mapConcert) : [];
}

export function mapLocationWeather(raw) {
  if (!raw) return null;
  return {
    location: {
      address: raw.location?.address ?? '',
      latitude: raw.location?.latitude ?? null,
      longitude: raw.location?.longitude ?? null,
      googleMapsUrl: raw.location?.google_maps_url ?? '#',
    },
    weather: {
      condition: raw.weather?.condition ?? 'Unavailable',
      temperatureCelsius: raw.weather?.temperature_celsius ?? null,
      temperatureFahrenheit: raw.weather?.temperature_fahrenheit ?? null,
      windspeedKmh: raw.weather?.windspeed_kmh ?? null,
      weathercode: raw.weather?.weathercode ?? null,
    },
  };
}