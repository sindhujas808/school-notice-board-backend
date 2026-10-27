import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../services/authService';
import * as departmentService from '../services/departmentService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'STUDENT',
    departmentId: '',
  });

  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    departmentService
      .getAllDepartments()
      .then((data) => setDepartments(data || []))
      .catch(() => {
        setDepartments([
          { id: 1, code: 'CSE', departmentName: 'Computer Science & Engineering' },
          { id: 2, code: 'ECE', departmentName: 'Electronics & Communication Engineering' },
          { id: 3, code: 'EEE', departmentName: 'Electrical & Electronics Engineering' },
          { id: 4, code: 'IT', departmentName: 'Information Technology' },
          { id: 5, code: 'AIDS', departmentName: 'Artificial Intelligence & Data Science' },
        ]);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        role: formData.role,
        departmentId: formData.departmentId ? Number(formData.departmentId) : null,
      };

      await authService.register(payload);
      setSuccess('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.data?.data && typeof err.response.data.data === 'object'
          ? Object.values(err.response.data.data).join(', ')
          : null) ||
        err.message ||
        'Registration failed. Please check your details.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const registrationRoles = [
    { id: 'STUDENT', label: 'Student', icon: '🎓', desc: 'Browse circulars, notices & download timetables' },
    { id: 'TEACHER', label: 'Teacher', icon: '👨‍🏫', desc: 'Publish departmental announcements & assignments' },
    { id: 'PARENT', label: 'Parent', icon: '👨‍👩‍👧', desc: 'Stay updated with student circulars & exam alerts' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '2.25rem',
          boxShadow: 'var(--shadow-lg)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '0.65rem',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(124, 58, 237, 0.1))',
              color: 'var(--primary)',
              fontSize: '1.75rem',
              marginBottom: '0.75rem',
            }}
          >
            📋
          </div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
            Create an Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join the School Notice Board Portal
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            Select Your Role:
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              background: '#f1f5f9',
              padding: '0.35rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            {registrationRoles.map((r) => {
              const isSelected = formData.role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleSelect(r.id)}
                  style={{
                    padding: '0.6rem 0.4rem',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? '#ffffff' : 'transparent',
                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.25rem', fontSize: '0.88rem' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              className="form-control"
              placeholder="e.g. Sindhuja Patel"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Username *
              </label>
              <input
                id="username"
                type="text"
                name="username"
                className="form-control"
                placeholder="Unique username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-control"
                placeholder="name@school.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {(formData.role === 'TEACHER' || formData.role === 'STUDENT') && (
            <div className="form-group">
              <label className="form-label" htmlFor="departmentId">
                Department
              </label>
              <select
                id="departmentId"
                name="departmentId"
                className="form-control"
                value={formData.departmentId}
                onChange={handleChange}
              >
                <option value="">Select Department (Optional)</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code ? `[${d.code}] ` : ''}{d.departmentName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password *
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-control"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '0.75rem', padding: '0.75rem' }}
          >
            {loading ? 'Creating Account...' : `Register as ${formData.role}`}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border)',
            paddingTop: '1.25rem',
          }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
