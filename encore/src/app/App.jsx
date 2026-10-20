import { CalendarLtrRegular, PersonRegular } from '@fluentui/react-icons';
import { useEffect, useRef, useState } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isAuthPage && !auth.accessToken) navigate('/', { replace: true });
  }, [auth.accessToken, isAuthPage, navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthPage && !auth.accessToken) return null;

  return (
    <div className={`app-shell${isAuthPage ? ' auth-shell' : ''}`}>
      {!isAuthPage && (
        <header className="app-header encore-header">
          <Link className="app-logo" to="/" aria-label="Encore home">ENCORE</Link>
          <nav className="app-nav" aria-label="Primary navigation">
            <NavLink to="/discover" className={({ isActive }) => isActive ? 'active' : ''}><CalendarLtrRegular aria-hidden="true" />Discover</NavLink>
            <NavLink to="/organizer" className={({ isActive }) => isActive ? 'active' : ''}><PersonRegular aria-hidden="true" />My Shows</NavLink>
            <NavLink to="/reservations" className={({ isActive }) => isActive ? 'active' : ''}><CalendarLtrRegular aria-hidden="true" />My Reservations</NavLink>
            <NavLink to="/post-show" className={({ isActive }) => isActive ? 'active' : ''}><span aria-hidden="true">＋</span>Post a Show</NavLink>
          </nav>
          
          <div className="header-profile-container" ref={menuRef} style={{ position: 'relative', marginLeft: 'auto' }}>
            <button
              className="header-profile"
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-label="Account options"
            >
              <PersonRegular aria-hidden="true" />
              {auth.user?.name || auth.user?.email || 'Account'}
            </button>

            {isMenuOpen && (
              <div
                className="profile-dropdown-menu"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  background: '#171627',
                  border: '1px solid #29283f',
                  borderRadius: '12px',
                  padding: '8px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                  zIndex: 100,
                  minWidth: '180px',
                }}
              >
                <div style={{ padding: '8px 12px', borderBottom: '1px solid #29283f', marginBottom: '6px' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#f4f1eb' }}>
                    {auth.user?.name || 'Encore User'}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#918da9' }}>
                    {auth.user?.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    dispatch(logout());
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '0',
                    borderRadius: '8px',
                    background: 'transparent',
                    color: '#ffd6d6',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                  }}
                  onMouseEnter={(e) => (e.target.style.background = '#5c252c')}
                  onMouseLeave={(e) => (e.target.style.background = 'transparent')}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>
      )}
      <main className="app-content"><Outlet /></main>
    </div>
  );
}