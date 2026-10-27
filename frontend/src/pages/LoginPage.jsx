import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ROLES = [
  { id: 'ADMIN', label: 'Admin', icon: '👑', subtitle: 'System Administrator' },
  { id: 'TEACHER', label: 'Teacher', icon: '👨‍🏫', subtitle: 'Faculty Member' },
  { id: 'STUDENT', label: 'Student', icon: '🎓', subtitle: 'Enrolled Student' },
  { id: 'PARENT', label: 'Parent', icon: '👪', subtitle: 'Guardian / Parent' },
];

const LoginPage = () => {
  const [selectedRole, setSelectedRole] = useState('ADMIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    const errors = { username: '', password: '' };
    let isValid = true;

    if (!username.trim()) {
      errors.username = 'Please enter your username or email.';
      isValid = false;
    }
    if (!password) {
      errors.password = 'Please enter your password.';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const user = await login(username.trim(), password);
      
      // Role validation warning if user logged in with a different role account
      if (selectedRole && user.role !== selectedRole) {
        console.info(`Authenticated as ${user.role} (selected persona was ${selectedRole})`);
      }

      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'TEACHER') {
        navigate('/teacher/dashboard');
      } else if (user.role === 'STUDENT' || user.role === 'PARENT') {
        navigate('/student/dashboard');
      } else {
        navigate(from === '/login' ? '/' : from);
      }
    } catch (err) {
      const msg = err.response?.data?.message || (err.response?.status === 401 ? 'Invalid username or password.' : 'Authentication failed. Please try again.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (fieldErrors.username) {
      setFieldErrors((prev) => ({ ...prev, username: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (fieldErrors.password) {
      setFieldErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  return (
    <div className="container-auth">
      <div className="card" style={{ padding: '2.25rem 2rem' }}>
        {/* School Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.4rem',
              marginBottom: '0.85rem',
              boxShadow: '0 4px 12px var(--primary-glow)',
            }}
          >
            📋
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.35rem', color: 'var(--text-main)' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4' }}>
            Sign in to access your school notices and dashboard
          </p>
        </div>

        {/* 4 Selectable User Roles */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Select Your Role
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
            }}
          >
            {ROLES.map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.65rem 0.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                    color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px var(--primary-glow)' : 'none',
                  }}
                  title={r.subtitle}
                >
                  <span style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{r.icon}</span>
                  <span style={{ fontSize: '0.8rem' }}>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username or Email
            </label>
            <input
              id="username"
              type="text"
              name="username"
              autoComplete="username"
              className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
              placeholder={`Enter ${ROLES.find(r => r.id === selectedRole)?.label || 'user'} username or email`}
              value={username}
              onChange={handleUsernameChange}
              disabled={loading}
            />
            {fieldErrors.username && (
              <span className="form-error">{fieldErrors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password"
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {fieldErrors.password && (
              <span className="form-error">{fieldErrors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : `Sign In as ${ROLES.find(r => r.id === selectedRole)?.label || 'User'}`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Register here
            </Link>
          </span>
          <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ← Back to Public Notice Board
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
