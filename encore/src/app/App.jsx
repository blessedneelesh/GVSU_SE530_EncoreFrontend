import { CalendarLtrRegular, PersonRegular } from '@fluentui/react-icons';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { AppProviders } from './providers';
import './app.css';

export default function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/signup';
  return (
    <FluentProvider theme={webLightTheme}>
      <AppProviders>
        <div className={`app-shell${isAuthPage ? ' auth-shell' : ''}`}>
          {!isAuthPage && <header className="app-header encore-header">
            <Link className="app-logo" to="/" aria-label="Encore home">ENCORE</Link>
            <nav className="app-nav" aria-label="Primary navigation">
              <NavLink to="/discover" className={({ isActive }) => isActive ? 'active' : ''}><CalendarLtrRegular aria-hidden="true" />Discover</NavLink>
              <NavLink to="/organizer" className={({ isActive }) => isActive ? 'active' : ''}><PersonRegular aria-hidden="true" />My events</NavLink>
            </nav>
            <Link className="header-profile" to="/" aria-label="Sign out of Alex's account"><PersonRegular aria-hidden="true" />Alex</Link>
          </header>}
          <main className="app-content"><Outlet /></main>
        </div>
      </AppProviders>
    </FluentProvider>
  );
}
