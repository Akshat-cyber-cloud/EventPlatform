import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Section1 from './pages/Section1';
import Section2 from './pages/Section2';
import Marquee from './components/Marquee';
import SmoothScroll from './components/SmoothScroll';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import EventsView from './pages/DashboardViews/EventsView';
import AnnouncementsView from './pages/DashboardViews/AnnouncementsView';
import TicketsView from './pages/DashboardViews/TicketsView';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

const Landing = () => (
  <SmoothScroll>
    <main>
      <Home />
      <Marquee />
      <Section1 />
      <Section2 />
    </main>
  </SmoothScroll>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route index element={<EventsView />} />
            <Route path="announcements" element={<AnnouncementsView />} />
            <Route path="tickets" element={<TicketsView />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;