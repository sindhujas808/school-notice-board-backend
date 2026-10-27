import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="container-narrow">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Notification Center</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Stay updated with school circulars and urgent alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={markAllAsRead}>
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      <div className="card">
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>You have no notifications at this time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: n.readStatus === 'UNREAD' ? 'var(--primary-light)' : '#f8fafc',
                  border: '1px solid var(--border)',
                  borderLeft: n.readStatus === 'UNREAD' ? '4px solid var(--primary)' : '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{n.title}</strong>
                    {n.readStatus === 'UNREAD' && (
                      <span className="badge" style={{ backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.65rem' }}>
                        NEW
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.25rem' }}>{n.message}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <Link
                    to={`/notices/${n.noticeId}`}
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      if (n.readStatus === 'UNREAD') markAsRead(n.id);
                    }}
                  >
                    View Notice
                  </Link>
                  {n.readStatus === 'UNREAD' && (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => markAsRead(n.id)}
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
