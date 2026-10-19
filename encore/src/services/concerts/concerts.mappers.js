export function mapConcert(concert) {
  const source = concert?.data ?? concert;
  const date = source.date ? new Date(`${source.date}T${source.time || '00:00:00'}`) : null;
  return {
    ...source,
    id: String(source.id ?? source.concertId),
    ownerId: String(source.owner_id ?? source.ownerId ?? source.organizerId ?? ''),
    title: source.title ?? source.name ?? 'Untitled concert',
    category: source.category ?? source.genre ?? 'Live music',
    genre: source.genre ?? source.category ?? 'Live music',
    date: date && !Number.isNaN(date.getTime())
      ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
      : source.date ?? source.startDate ?? 'Date to be announced',
    location: source.location ?? [source.venue, source.city, source.state].filter(Boolean).join(', ') ?? 'Location to be announced',
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
