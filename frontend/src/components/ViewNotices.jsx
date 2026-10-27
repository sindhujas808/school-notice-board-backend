import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as noticeService from '../services/noticeService';
import { useAuth } from '../contexts/AuthContext';
import { formatDepartmentDisplay } from '../services/departmentConstants';
import DeleteNotice from './DeleteNotice';

const ViewNotices = ({ customNotices, onEdit, refreshTrigger }) => {
  const { user, isAdmin, isTeacher } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(!customNotices);
  const [selectedNoticeForDelete, setSelectedNoticeForDelete] = useState(null);

  const fetchNotices = useCallback(async () => {
    if (customNotices) {
      setNotices(customNotices);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let data;
      if (user) {
        data = await noticeService.getAllNotices({ size: 50, sortBy: 'publishDate', sortDir: 'desc' });
      } else {
        data = await noticeService.getPublicNotices({ size: 50, sortBy: 'publishDate', sortDir: 'desc' });
      }
      setNotices(data && data.content ? data.content : []);
    } catch (e) {
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, [customNotices, user]);

  useEffect(() => {
    if (customNotices) {
      setNotices(customNotices);
      setLoading(false);
    } else {
      fetchNotices();
    }
  }, [customNotices, fetchNotices, refreshTrigger]);

  const handleDeleteSuccess = (deletedId) => {
    setNotices((prev) => prev.filter((n) => n.id !== deletedId));
    setSelectedNoticeForDelete(null);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'URGENT': return 'badge-urgent';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const canManageNotice = (notice) => {
    if (isAdmin) return true;
    if (isTeacher && user && notice.authorId === user.id) return true;
    return false;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading notices...</p>
      </div>
    );
  }

  if (!notices || notices.length === 0) {
    return (
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '3.5rem 2rem',
          borderStyle: 'dashed',
          backgroundColor: '#f8fafc',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#e2e8f0',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            color: 'var(--text-muted)',
          }}
        >
          📋
        </div>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          No notices available
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
          New announcements will appear here when they are published.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {notices.map((notice) => (
        <article
          key={notice.id}
          className="notice-card"
          style={{
            borderLeft: notice.priority === 'URGENT'
              ? '4px solid var(--danger)'
              : notice.priority === 'HIGH'
              ? '4px solid var(--warning)'
              : '1px solid var(--border)',
          }}
        >
          {/* Header Badges & Date */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {notice.isPinned && (
                <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                  📌 Pinned
                </span>
              )}
              {notice.priority && (
                <span className={`badge ${getPriorityClass(notice.priority)}`}>
                  {notice.priority}
                </span>
              )}
              {notice.categoryName && (
                <span
                  className="badge badge-category"
                  style={{
                    backgroundColor: notice.categoryColor ? `${notice.categoryColor}18` : undefined,
                    color: notice.categoryColor || undefined,
                  }}
                >
                  {notice.categoryName}
                </span>
              )}
              {notice.departmentName && (
                <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                  {formatDepartmentDisplay(notice.departmentName)}
                </span>
              )}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              📅 {formatDate(notice.publishDate)}
            </div>
          </div>

          {/* Title */}
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', lineHeight: '1.4' }}>
            <Link
              to={`/notices/${notice.id}`}
              style={{
                color: 'var(--text-main)',
                fontWeight: 700,
                transition: 'color 0.15s ease',
              }}
            >
              {notice.title}
            </Link>
          </h3>

          {/* Snippet */}
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.92rem',
              lineHeight: '1.6',
              marginBottom: '1.25rem',
              whiteSpace: 'pre-line',
            }}
          >
            {notice.content && notice.content.length > 220
              ? `${notice.content.substring(0, 220)}...`
              : notice.content}
          </p>

          {/* Card Footer: Metadata & Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.85rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Posted by: <strong style={{ color: 'var(--text-main)' }}>{notice.authorName || 'School Faculty'}</strong>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to={`/notices/${notice.id}`} className="btn btn-secondary btn-sm">
                View Details
              </Link>

              {canManageNotice(notice) && (
                <>
                  {onEdit ? (
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => onEdit(notice)}
                    >
                      Edit
                    </button>
                  ) : (
                    <Link to={`/teacher/edit-notice/${notice.id}`} className="btn btn-secondary btn-sm">
                      Edit
                    </Link>
                  )}

                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setSelectedNoticeForDelete(notice)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </article>
      ))}

      {selectedNoticeForDelete && (
        <DeleteNotice
          noticeId={selectedNoticeForDelete.id}
          noticeTitle={selectedNoticeForDelete.title}
          onDeleteSuccess={() => handleDeleteSuccess(selectedNoticeForDelete.id)}
          onCancel={() => setSelectedNoticeForDelete(null)}
        />
      )}
    </div>
  );
};

export default ViewNotices;
