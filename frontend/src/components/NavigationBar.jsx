import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const NavigationBar = () => {
  const { user, isAuthenticated, isAdmin, isTeacher, isStudent, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.25rem',
              boxShadow: '0 2px 8px var(--primary-glow)',
            }}
          >
            📋
          </div>
          <div>
            <span
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.2,
              }}
            >
              NoticeHub
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
              }}
            >
              SCHOOL NOTICE SYSTEM
            </span>
          </div>
        </Link>

        {/* Mobile menu toggle button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="btn btn-secondary btn-sm"
          style={{
            display: 'none',
            padding: '0.4rem 0.6rem',
            fontSize: '1rem',
          }}
          aria-label="Toggle navigation menu"
          id="mobile-nav-toggle"
        >
          ☰
        </button>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Public Board
          </Link>

          <Link
            to="/about"
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            About
          </Link>

          {isAuthenticated ? (
            <>
              {isStudent && (
                <Link
                  to="/student/dashboard"
                  className={`nav-link ${isActive('/student/dashboard') ? 'active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
              )}

              {isTeacher && (
                <>
                  <Link
                    to="/teacher/dashboard"
                    className={`nav-link ${isActive('/teacher/dashboard') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/teacher/create-notice"
                    className={`nav-link ${isActive('/teacher/create-notice') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    + Add Notice
                  </Link>
                  <Link
                    to="/teacher/analytics"
                    className={`nav-link ${isActive('/teacher/analytics') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    Analytics
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    Admin Hub
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/audit-logs"
                    className={`nav-link ${isActive('/admin/audit-logs') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    Audit
                  </Link>
                  <Link
                    to="/teacher/analytics"
                    className={`nav-link ${isActive('/teacher/analytics') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    Analytics
                  </Link>
                </>
              )}

              {/* Notification icon */}
              <Link
                to="/notifications"
                className="btn btn-secondary btn-sm"
                style={{ position: 'relative', margin: '0 0.25rem' }}
                onClick={closeMobileMenu}
                title="Notifications"
              >
                🔔
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: 'var(--danger)',
                      color: 'white',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* User badge & logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.25rem' }}>
                <Link
                  to="/profile"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    padding: '0.35rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border)',
                  }}
                  onClick={closeMobileMenu}
                >
                  👤 {user?.fullName || user?.username} <span style={{ color: 'var(--primary)', fontWeight: 700 }}>({user?.role})</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
              <Link
                to="/register"
                className="btn btn-secondary btn-sm"
                onClick={closeMobileMenu}
              >
                Register
              </Link>
              <Link
                to="/login"
                className="btn btn-primary btn-sm"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;
