import React, { useState, useEffect } from 'react';
import * as analyticsService from '../services/analyticsService';

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await analyticsService.getAnalyticsSummary();
        setSummary(data);
      } catch (err) {
        setError('Failed to load analytics dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading live analytics data...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--danger)' }}>{error || 'Analytics unavailable.'}</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>Notice Board Analytics & Insights 📊</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Real-time performance metrics, department output, and student engagement analysis
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-value">{summary.totalNotices}</span>
          <span className="stat-label">Total Notices</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--secondary)' }}>{summary.totalViews}</span>
          <span className="stat-label">Total Student Views</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--accent)' }}>{summary.totalLikes}</span>
          <span className="stat-label">Engagement Likes</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--danger)' }}>{summary.urgentNotices}</span>
          <span className="stat-label">Urgent Alerts</span>
        </div>
      </div>

      {/* 1. Department Performance Analysis (SRS JPQL) */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem' }}>Department Performance Analysis</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Evaluates announcement frequency, average reads per notice, and urgent alerts by department
          </p>
        </div>

        {summary.departmentStats && summary.departmentStats.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Department</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Total Notices</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Average Reads</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Urgent Circulars</th>
                </tr>
              </thead>
              <tbody>
                {summary.departmentStats.map((dept, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{dept.departmentName}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{dept.totalNotices}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{dept.averageReads ? dept.averageReads.toFixed(1) : '0.0'}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={dept.urgentNotices > 0 ? 'badge badge-urgent' : 'badge badge-low'}>
                        {dept.urgentNotices}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No department statistics recorded yet.</p>
        )}
      </div>

      {/* 2. Content Category Analysis (SRS JPQL) */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem' }}>Content Category Analysis</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Metrics on notice distribution and student interaction scores across categories
          </p>
        </div>

        {summary.categoryStats && summary.categoryStats.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Notice Count</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Avg Engagement Score</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Max Notice Reads</th>
                </tr>
              </thead>
              <tbody>
                {summary.categoryStats.map((cat, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{cat.categoryName}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{cat.noticeCount}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{cat.avgEngagement ? cat.avgEngagement.toFixed(1) : '0.0'}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{cat.maxReads || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No category metrics recorded yet.</p>
        )}
      </div>

      {/* 3. User Engagement Analytics (SRS JPQL) */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.3rem' }}>Top Engaged Notices (Reads & Likes)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Individual notice performance ranked by verified read counts
          </p>
        </div>

        {summary.topNotices && summary.topNotices.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Notice Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Delivered Notifications</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Confirmed Reads</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Like Rate</th>
                </tr>
              </thead>
              <tbody>
                {summary.topNotices.map((n, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{n.title}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{n.totalNotifications}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{n.readCount}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {n.likeRate ? `${(n.likeRate * 100).toFixed(0)}%` : '0%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No notice statistics available yet.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
