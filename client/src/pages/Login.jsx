import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Student Login</h2>
      
      <div className="campus-restriction-card" style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        <h4 style={{ color: '#10B981', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          🔐 For IGDTUW Students
        </h4>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>
          Access CampusFind using your @igdtuw.ac.in email address.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label"><Mail size={16} style={{ marginRight: '6px' }} /> Campus Email</label>
          <input
            type="email"
            className="form-input"
            placeholder="yourname@igdtuw.ac.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label"><Lock size={16} style={{ marginRight: '6px' }} /> Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={submitting}>
          <LogIn size={20} />
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="form-footer">
        Don't have an account yet? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default Login;
