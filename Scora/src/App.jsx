import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login/login';
import Dashboard from './pages/Dashboard';
import Assessments from './pages/Assessments';
import Test from './pages/Tests';  // Ensure this matches the import and route parameter
import Analyticspage from './pages/Analyticspage';
import Insights from './pages/Insights';
import Admin from './pages/Admin';
import AddAssessments from './pages/AddAssessments';
import Courses from './pages/Courses';

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Function to check if the user is authenticated
const isAuthenticated = () => {
  return sessionStorage.getItem('user') !== null;
};

// Component for protected routes
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Layout component for protected routes
const ProtectedLayout = () => (
  <QueryClientProvider client={queryClient}>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assessments" element={<Assessments />} />
      <Route path="/tests/:testId" element={<Test />} /> {/* Updated testId */}
      <Route path="/admin" element={<Admin />} />
      <Route path="/add" element={<AddAssessments />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </QueryClientProvider>
);

// Main App component
const App = () => (
  <Router>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/analytics" element={<Analyticspage />} />
      <Route path="/insights" element={<Insights />} />
      <Route path="/recommendations" element={<Courses />} />
      
      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        }
      />
      
      {/* Fallback Route: Redirect to Landing Page if no routes match */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </Router>
);

export default App;