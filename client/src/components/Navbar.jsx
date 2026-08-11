import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, PlusCircle, Bookmark, LogIn, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <Link to="/" className="logo-container">
        <span className="logo-icon">
          <Compass size={32} />
        </span>
        <span>CampusFind</span>
      </Link>

      <nav>
        <ul className="nav-links">
          {user && (
            <>
              <li>
                <Link to="/add" className={isActive('/add') ? 'active' : ''}>
                  <PlusCircle size={18} /> Report Item
                </Link>
              </li>
              <li>
                <Link to="/my-posts" className={isActive('/my-posts') ? 'active' : ''}>
                  <Bookmark size={18} /> My Posts
                </Link>
              </li>
            </>
          )}

          {user ? (
            <>
              <li>
                <div className="nav-user-badge">
                  <UserIcon size={16} />
                  <span>{user.name}</span>
                </div>
              </li>
              <li>
                <button onClick={logout} className="nav-logout-btn">
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="nav-signin-btn">
                <LogIn size={18} /> Sign In
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
