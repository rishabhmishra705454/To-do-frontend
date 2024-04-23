import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUp from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewDashboard from './components/NewDashboard';

// Custom route component for handling authentication
const PrivateRoute = ({ element, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  return isAuthenticated ? (
    // If authenticated, render the requested route
    React.cloneElement(element, rest)
  ) : (
    // If not authenticated, redirect to the login page
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* Use PrivateRoute for the dashboard route */}
        <Route path="/" element={<PrivateRoute element={<NewDashboard />} />} />
      </Routes>
    </Router>
  );
}

export default App;
