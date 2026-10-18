import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();
  return <main className="login-page" aria-labelledby="signup-heading"><section className="login-card"><div className="login-brand">ENCORE</div><div className="login-heading"><h1 id="signup-heading">Join Encore</h1><p>Create an account to discover and reserve unforgettable events.</p></div><form className="login-form" onSubmit={(event) => { event.preventDefault(); navigate('/dashboard'); }}><label htmlFor="signup-name">Name</label><input id="signup-name" className="dark-input" placeholder="Your name" required /><label htmlFor="signup-email">Email</label><input id="signup-email" type="email" className="dark-input" placeholder="you@encore.fm" required /><label htmlFor="signup-password">Password</label><input id="signup-password" type="password" className="dark-input" placeholder="Create a password" required /><button className="login-submit" type="submit">Create account</button></form><p className="login-signup">Already have an account? <Link to="/">Sign in</Link></p></section></main>;
}
