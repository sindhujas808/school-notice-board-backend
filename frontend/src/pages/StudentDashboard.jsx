import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import ViewNotices from '../components/ViewNotices';
import NoticeSearch from '../components/NoticeSearch';
import * as noticeService from '../services/noticeService';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudentNotices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await noticeService.getAllNotices({ size: 20, sortBy: 'publishDate', sortDir: 'desc' });
      setNotices(data && data.content ? data.content : []);
    } catch (e) {
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentNotices();
  }, [fetchStudentNotices]);

  const handleSearch = async (keyword) => {
    if (!keyword) {
      fetchStudentNotices();
      return;
    }
    try {
      const data = await noticeService.searchNotices({ keyword, size: 20 });
      setNotices(data && data.content ? data.content : []);
    } catch (e) {
      setNotices([]);
    }
  };

  const urgentCount = notices.filter((n) => n.priority === 'URGENT').length;

  return (
    <div>
      {/* Student Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
          color: 'white',
          padding: '2rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ color: 'white', fontSize: '1.85rem', marginBottom: '0.4rem' }}>
          Welcome, {user?.fullName || 'Student'} 👋
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Department: <strong>{user?.departmentName || 'General Student Body'}</strong> • Role: <strong>STUDENT</strong>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-value">{notices.length}</span>
          <span className="stat-label">Active Targeted Notices</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--danger)' }}>{urgentCount}</span>
          <span className="stat-label">Urgent Circulars</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--accent)' }}>{unreadCount}</span>
          <span className="stat-label">
            <Link to="/notifications" style={{ color: 'inherit' }}>
              Unread Notifications →
            </Link>
          </span>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <NoticeSearch onSearch={handleSearch} />
      </div>

      {/* Notices */}
      <div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Your Announcements & Feed</h2>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading student notices...</p>
        ) : (
          <ViewNotices customNotices={notices} />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
