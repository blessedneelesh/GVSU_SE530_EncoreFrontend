import { Link } from 'react-router-dom';
export default function NotFoundPage() { return <section className="state-panel"><h1>Page not found</h1><p>The page you requested does not exist.</p><Link to="/">Return to library</Link></section>; }
