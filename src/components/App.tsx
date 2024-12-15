import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './layout/Navbar';
import Home from '../pages/Home';
import ImageUpload from '../pages/ImageUpload';
import TiffList from '../pages/TiffList';
import GeoJSONList from '../pages/GeoJSONList';
import Login from './auth/Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

const ProtectedRoute = ({ children, isAuthenticated }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize state from localStorage during first render
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedLastActivity = localStorage.getItem('lastActivity');
    
    if (storedAuth === 'true' && storedLastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(storedLastActivity);
      if (timeSinceLastActivity < TIMEOUT_DURATION) {
        return true;
      }
    }
    return false;
  });

  const [lastActivity, setLastActivity] = useState(() => {
    // Initialize lastActivity from localStorage or current time
    const storedLastActivity = localStorage.getItem('lastActivity');
    return storedLastActivity ? parseInt(storedLastActivity) : Date.now();
  });

  useEffect(() => {
    // Set up activity listeners
    const updateActivity = () => {
      const currentTime = Date.now();
      setLastActivity(currentTime);
      localStorage.setItem('lastActivity', currentTime.toString());
    };

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    // Check for inactivity
    const inactivityCheck = setInterval(() => {
      const currentTime = Date.now();
      const storedLastActivity = localStorage.getItem('lastActivity');
      
      if (storedLastActivity && isAuthenticated) {
        const timeSinceLastActivity = currentTime - parseInt(storedLastActivity);
        if (timeSinceLastActivity >= TIMEOUT_DURATION) {
          handleLogout();
        }
      }
    }, 60000); // Check every minute

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(inactivityCheck);
    };
  }, [isAuthenticated]);

  // Update localStorage when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('lastActivity');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login onLogin={setIsAuthenticated} />} />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/image-upload"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ImageUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tiff-list"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <TiffList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/geojson-list"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <GeoJSONList />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;