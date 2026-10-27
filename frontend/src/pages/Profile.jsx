import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container-narrow">
      <div className="card">
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1.25rem' }}>User Profile</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 800,
            }}
          >
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>{user.fullName}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>@{user.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Email Address
            </span>
            <p style={{ fontSize: '1rem', fontWeight: 500, marginTop: '0.25rem' }}>{user.email || 'N/A'}</p>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Assigned Role
            </span>
            <p style={{ fontSize: '1rem', fontWeight: 500, marginTop: '0.25rem' }}>
              <span className="badge" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
                {user.role}
              </span>
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Department
            </span>
            <p style={{ fontSize: '1rem', fontWeight: 500, marginTop: '0.25rem' }}>
              {user.departmentName || 'All / General'}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Account Status
            </span>
            <p style={{ fontSize: '1rem', fontWeight: 500, marginTop: '0.25rem' }}>
              <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                Verified & Active
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
