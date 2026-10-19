import { CalendarLtrRegular, PersonRegular } from '@fluentui/react-icons';
import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { AppProviders } from './providers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { logout } from '../redux/auth/auth.actions';
import { selectAuth } from '../redux/auth/auth.selectors';
import './app.css';

export default function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <AppProviders>
        <AppShell />
      </AppProviders>
    </FluentProvider>
  );
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const isAuthPage = location.pathname === '/' || location.pathname === '/signup';

  useEffect(() => {
    if (!isAuthPage && !auth.accessToken) navigate('/', { replace: true });
  }, [auth.accessToken, isAuthPage, navigate]);

  if (!isAuthPage && !auth.accessToken) return null;
  return (
    <div className={`app-shell${isAuthPage ? ' auth-shell' : ''}`}>
      {!isAuthPage && <header className="app-header encore-header">
        <Link className="app-logo" to="/" aria-label="Encore home">ENCORE</Link>
        <nav className="app-nav" aria-label="Primary navigation">
          <NavLink to="/discover" className={({ isActive }) => isActive ? 'active' : ''}><CalendarLtrRegular aria-hidden="true" />Discover</NavLink>
          <NavLink to="/organizer" className={({ isActive }) => isActive ? 'active' : ''}><PersonRegular aria-hidden="true" />My Shows</NavLink>
          <NavLink to="/reservations" className={({ isActive }) => isActive ? 'active' : ''}><CalendarLtrRegular aria-hidden="true" />My Reservations</NavLink>
          <NavLink to="/post-show" className={({ isActive }) => isActive ? 'active' : ''}><span aria-hidden="true">＋</span>Post a Show</NavLink>
        </nav>
        <button className="header-profile" type="button" onClick={() => { dispatch(logout()); }} aria-label="Sign out of your account"><PersonRegular aria-hidden="true" />{auth.user?.name || auth.user?.email || 'Account'}</button>
      </header>}
      <main className="app-content"><Outlet /></main>
    </div>
  );
}
