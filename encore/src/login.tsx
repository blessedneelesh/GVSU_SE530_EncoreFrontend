import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { login } from './redux/auth/auth.actions';
import { selectAuthError, selectAuthStatus, selectIsAuthenticated } from './redux/auth/auth.selectors';
import './Login.css';

type DemoAccount = {
  label: string;
  email: string;
};

const demoAccounts: DemoAccount[] = [
  { label: 'Alex (Fan + Organizer)', email: 'alex@encore.fm' },
  { label: 'Maya (Organizer)', email: 'maya@encore.fm' },
  { label: 'Jordan', email: 'jordan@encore.fm' },
];

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/discover', { replace: true });
  }, [isAuthenticated, navigate]);

  function handleDemoAccount(account: DemoAccount) {
    setEmail(account.email);
    setPassword('pass123');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(login({ email: email.trim(), password }));
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-heading">
        <div className="login-brand">ENCORE</div>

        <div className="login-heading">
          <h1 id="login-heading">Welcome back</h1>
          <p>Sign in to your Encore account</p>
        </div>

        <div className="login-demo">
          <p>
            Demo accounts — all use password <strong>pass123</strong>
          </p>
          <div className="login-demo-actions">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                className="login-demo-button"
                onClick={() => handleDemoAccount(account)}
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@encore.fm"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="login-password-input">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="login-password-toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              <span aria-hidden="true">{showPassword ? '◉' : '◌'}</span>
            </button>
          </div>

          <button type="submit" className="login-submit" disabled={authStatus === 'loading'}>
            {authStatus === 'loading' ? 'Signing in...' : 'Sign In'}
          </button>
          {authError && <p className="login-error" role="alert">{authError}</p>}
        </form>

        <p className="login-signup">
          Don&apos;t have an account?           <button type="button" onClick={() => navigate('/signup')}>Create one</button>
        </p>
      </section>
    </main>
  );
}

export default Login;
