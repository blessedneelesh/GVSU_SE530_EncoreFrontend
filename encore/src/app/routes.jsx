import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import Login from '../login';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import DiscoverPage from '../pages/DiscoverPage/DiscoverPage';
import EventDetailsPage from '../pages/EventDetailsPage/EventDetailsPage';
import OrganizerPage from '../pages/OrganizerPage/OrganizerPage';
import SignupPage from '../pages/SignupPage/SignupPage';
import PostShowPage from '../pages/PostShowPage/PostShowPage';
import ReservationsPage from '../pages/ReservationsPage/ReservationsPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/organizer" element={<OrganizerPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/post-show" element={<PostShowPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
