import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as analyticsService from '../services/analyticsService';
import * as auditLogService from '../services/auditLogService';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      try {
        const [sumData, logsData] = await Promise.all([
          analyticsService.getAnalyticsSummary(),
          auditLogService.getRecentAuditLogs(),
        ]);
        setSummary(sumData);
        setRecentLogs(logsData || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadAdminData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>System Administration Hub 👑</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Full system control, user provisioning, audit logging, and content governance
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/users" className="btn btn-primary">
            👥 User Management
          </Link>
          <Link to="/teacher/create-notice" className="btn btn-secondary">
            + Publish Notice
          </Link>
          <Link to="/admin/audit-logs" className="btn btn-secondary">
            📜 Audit Trail
          </Link>
        </div>
      </div>

      {/* Admin KPI Stats */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-value">{summary?.totalUsers || 0}</span>
          <span className="stat-label">Active Users</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--primary)' }}>{summary?.totalNotices || 0}</span>
          <span className="stat-label">Total Notices</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--success)' }}>{summary?.totalDepartments || 0}</span>
          <span className="stat-label">Departments</span>
        </div>

        <div className="stat-card">
          <span className="stat-value" style={{ color: 'var(--accent)' }}>{summary?.totalCategories || 0}</span>
          <span className="stat-label">Notice Categories</span>
        </div>
      </div>

      {/* Quick Action & Management Tiles */}
      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>👥 User Directory</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Register new faculty or student accounts, reset credentials, and unlock locked accounts.
          </p>
          <Link to="/admin/users" className="btn btn-secondary btn-sm">
            Manage Accounts →
          </Link>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>📊 Live Analytics</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Explore department output, read ratios, student engagement scores, and urgent notices.
          </p>
          <Link to="/teacher/analytics" className="btn btn-secondary btn-sm">
            View Analytics →
          </Link>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>🛡️ Security & Audits</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Track every login attempt, notice publication, content deletion, and security event.
          </p>
          <Link to="/admin/audit-logs" className="btn btn-secondary btn-sm">
            View Security Logs →
          </Link>
        </div>
      </div>

      {/* Recent Audit Activity */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>Recent System Activity Logs</h2>
          <Link to="/admin/audit-logs" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            View Full Log →
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No audit events logged yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Timestamp</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>User</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Action</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.slice(0, 8).map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{log.username}</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      <span className="badge" style={{ backgroundColor: '#e2e8f0', color: '#1e293b' }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-muted)' }}>{log.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
