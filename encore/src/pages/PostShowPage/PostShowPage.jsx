import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConcerts } from '../../hooks/useConcerts';

const initialForm = {
  title: '', venue: '', city: '', state: '', date: '', time: '',
  capacity: '150', genre: 'Indie Rock', mood: 'Happy', description: '', image_url: '',
};

const genres = ['Indie Rock', 'Psychedelic Rock', 'Electronic', 'Blues Rock', 'Jazz', 'Shoegaze', 'Folk', 'Post-Rock', 'Indie Pop', 'Hip-Hop', 'Country', 'Metal', 'Pop', 'R&B', 'Classical', 'Other'];
const moods = ['Sad', 'Angry', 'Happy'];

export default function PostShowPage() {
  const navigate = useNavigate();
  const { createStatus, createError, create } = useConcerts();
  const [form, setForm] = useState(initialForm);
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    create({
      ...form,
      date: new Date(`${form.date}T${form.time}`).toISOString(),
      time: form.time,
      capacity: Number(form.capacity),
      mood: form.mood,
      description: form.description || null,
      genre: form.genre || null,
      image_url: form.image_url || null,
    });
  };

  return (
    <div className="encore-page post-show-page">
      <div className="post-show-heading">
        <h1>Post a Show</h1>
        <p className="muted">Publish your event so fans can find it and reserve seats.</p>
      </div>
      <form className="show-form show-form-card" onSubmit={submit}>
        <div className="cover-upload">
          <label htmlFor="show-image">Cover Image</label>
          <div className={`cover-preview${form.image_url ? ' has-image' : ''}`} style={form.image_url ? { backgroundImage: `url(${form.image_url})` } : undefined}>
            {!form.image_url && <span aria-hidden="true">＋</span>}
          </div>
          <input id="show-image" className="dark-input" type="url" value={form.image_url} onChange={update('image_url')} placeholder="Paste an image URL" />
        </div>
        <div className="show-form-field">
          <label htmlFor="show-title">Show Title</label>
          <input id="show-title" className="dark-input" value={form.title} onChange={update('title')} placeholder="e.g. Midnight Atlas" required />
        </div>
        <div className="form-grid">
          <div className="show-form-field"><label htmlFor="show-venue">Venue</label><input id="show-venue" className="dark-input" value={form.venue} onChange={update('venue')} placeholder="e.g. The Chapel" required /></div>
          <div className="show-form-field"><label htmlFor="show-genre">Genre</label><select id="show-genre" className="dark-input" value={form.genre} onChange={update('genre')}>{genres.map((genre) => <option key={genre}>{genre}</option>)}</select></div>
        </div>
        <div className="form-grid">
          <div className="show-form-field"><label htmlFor="show-mood">Mood</label><select id="show-mood" className="dark-input" value={form.mood} onChange={update('mood')} required>{moods.map((mood) => <option key={mood}>{mood}</option>)}</select></div>
        </div>
        <div className="form-grid">
          <div className="show-form-field"><label htmlFor="show-city">City</label><input id="show-city" className="dark-input" value={form.city} onChange={update('city')} placeholder="San Francisco" required /></div>
          <div className="show-form-field"><label htmlFor="show-state">State / Region</label><input id="show-state" className="dark-input" value={form.state} onChange={update('state')} placeholder="CA" required /></div>
        </div>
        <div className="form-grid">
          <div className="show-form-field"><label htmlFor="show-date">Date</label><input id="show-date" className="dark-input" type="date" value={form.date} onChange={update('date')} required /></div>
          <div className="show-form-field"><label htmlFor="show-time">Doors / Start Time</label><input id="show-time" className="dark-input" type="time" value={form.time} onChange={update('time')} required /></div>
        </div>
        <div className="show-form-field"><label htmlFor="show-description">Description</label><textarea id="show-description" className="dark-input" rows="4" value={form.description} onChange={update('description')} placeholder="Tell people about the show — artists, vibe, what to expect..." /></div>
        <div className="show-form-field"><label htmlFor="show-capacity">Seat Capacity</label><input id="show-capacity" className="dark-input" type="number" min="1" value={form.capacity} onChange={update('capacity')} required /><p className="field-hint">Maximum number of reservations allowed</p></div>
        {createError && <p className="form-error" role="alert">{createError}</p>}
        {createStatus === 'success' ? (
          <div className="show-success" role="status"><h2>Your show is live.</h2><p className="muted">Your event has been published to Encore.</p><button className="accent-button" type="button" onClick={() => navigate('/organizer')}>View My Shows</button></div>
        ) : (
          <div className="show-form-actions"><button className="outline-button" type="button" onClick={() => navigate('/organizer')}>Cancel</button><button className="accent-button" type="submit" disabled={createStatus === 'loading'}>{createStatus === 'loading' ? 'Publishing...' : 'Publish Show'}</button></div>
        )}
      </form>
    </div>
  );
}
