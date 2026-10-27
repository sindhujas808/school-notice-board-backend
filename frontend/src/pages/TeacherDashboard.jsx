import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ViewNotices from '../components/ViewNotices';
import * as noticeService from '../services/noticeService';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await noticeService.getAllNotices({ size: 50 });
      setNotices(data && data.content ? data.content : []);
    } catch (e) {
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const myNotices = notices.filter((n) => n.authorId === user?.id);
  const totalReads = myNotices.reduce((sum, n) => sum + (n.readCount || 0), 0);
  const totalLikes = myNotices.reduce((sum, n) => sum + (n.likeCount || 0), 0);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem' }}>Faculty Portal 👨‍🏫</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Logged in as <strong>{user?.fullName || user?.username}</strong> • Dept: {user?.departmentName || 'General'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/teacher/create-notice" className="btn btn-primary">
            + Create New Notice
          </Link>
          <Link to="/teacher/analytics" className="btn btn-secondary">
            📊 View Analytics
          </Link>
        </div>
      </div>

      {/* Teacher Stats */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-value">{myNotices.length}</span>
          <span className="stat-label">Your Published Notices</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--secondary)' }}>{totalReads}</span>
          <span className="stat-label">Total Student Reads</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--accent)' }}>{totalLikes}</span>
          <span className="stat-label">Student Likes</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--success)' }}>{notices.length}</span>
          <span className="stat-label">Campus-wide Notices</span>
        </div>
      </div>

      {/* Notice Management list */}
      <div>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1.25rem' }}>Your Notices & Circulars</h2>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading notices...</p>
        ) : (
          <ViewNotices customNotices={myNotices} refreshTrigger={fetchNotices} />
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
