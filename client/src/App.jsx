import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddItem from './pages/AddItem';
import MyPosts from './pages/MyPosts';

import { CheckCircle, AlertCircle } from 'lucide-react';

const ToastNotification = () => {
  const { toast } = useAuth();
  if (!toast) return null;

  return (
    <div className={`toast-banner ${toast.type}`}>
      {toast.type === 'error' ? <AlertCircle size={20} color="#ef4444" /> : <CheckCircle size={20} color="#10B981" />}
      <span>{toast.message}</span>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/add" 
                element={
                  <ProtectedRoute>
                    <AddItem />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-posts" 
                element={
                  <ProtectedRoute>
                    <MyPosts />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          <footer className="footer">
            <div className="footer-content">
              <p>
                © {new Date().getFullYear()} <span className="footer-highlight">CampusFind Portal</span> — Reconnecting students with lost belongings.
              </p>
            </div>
          </footer>

          <ToastNotification />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
