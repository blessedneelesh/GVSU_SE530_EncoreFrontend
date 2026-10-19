import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { register } from '../../redux/auth/auth.actions';
import { selectAuthError, selectAuthStatus, selectIsAuthenticated } from '../../redux/auth/auth.selectors';

export default function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/discover', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const derivedUsername = username.trim() || email.split('@')[0];
    dispatch(
      register({
        name: trimmedName,
        username: derivedUsername,
        email: email.trim(),
        password,
      }),
    );
  };

  return (
    <main className="login-page" aria-labelledby="signup-heading">
      <section className="login-card">
        <div className="login-brand">ENCORE</div>
        <div className="login-heading">
          <h1 id="signup-heading">Join Encore</h1>
          <p>Create an account to discover and reserve unforgettable events.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="signup-name">Name</label>
          <input
            id="signup-name"
            className="dark-input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="signup-username">Username</label>
          <input
            id="signup-username"
            className="dark-input"
            placeholder="your_username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            className="dark-input"
            placeholder="you@encore.fm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            className="dark-input"
            placeholder="Create a password (min 8 characters)"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login-submit" type="submit" disabled={authStatus === 'loading'}>
            {authStatus === 'loading' ? 'Creating account...' : 'Create account'}
          </button>

          {authError && (
            <p className="form-error" role="alert">
              {authError}
            </p>
          )}
        </form>
        <p className="login-signup">
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </section>
    </main>
  );
}