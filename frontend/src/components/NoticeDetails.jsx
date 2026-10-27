import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as noticeService from '../services/noticeService';
import * as notificationService from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';
import CommentSection from './CommentSection';
import AttachmentUpload from './AttachmentUpload';

const NoticeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isTeacher } = useAuth();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const fetchNotice = useCallback(async () => {
    setLoading(true);
    try {
      const data = await noticeService.getNoticeById(id);
      setNotice(data);
      setLikeCount(data.likeCount || 0);
    } catch (err) {
      setError('Notice not found or you do not have permission to view it.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNotice();
  }, [fetchNotice]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await notificationService.recordEngagement(notice.id, 'LIKE');
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    } catch (e) {
      console.error(e);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'URGENT': return 'badge-urgent';
      case 'HIGH': return 'badge-high';
      case 'MEDIUM': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  const canEdit = notice && (isAdmin || (isTeacher && user && notice.authorId === user.id));

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading notice details...</p>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <h3 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Notice Unavailable</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error || 'Notice not found.'}</p>
        <Link to="/" className="btn btn-primary">
          Back to Notice Board
        </Link>
      </div>
    );
  }

  return (
    <div className="container-narrow">
      <div style={{ marginBottom: '1.25rem' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="card">
        {/* Header Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className={`badge ${getPriorityClass(notice.priority)}`}>
              {notice.priority}
            </span>
            <span
              className="badge badge-category"
              style={{ backgroundColor: notice.categoryColor ? `${notice.categoryColor}20` : undefined, color: notice.categoryColor }}
            >
              {notice.categoryName}
            </span>
            {notice.departmentName && (
              <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                {notice.departmentName}
              </span>
            )}
            <span className="badge" style={{ backgroundColor: '#e2e8f0', color: '#334155' }}>
              {notice.audienceType}
            </span>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Published: {notice.publishDate ? new Date(notice.publishDate).toLocaleDateString() : 'N/A'}
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem', lineHeight: '1.3' }}>
          {notice.title}
        </h1>

        {/* Metadata bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            padding: '0.75rem 0',
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            Author: <strong>{notice.authorName}</strong> ({notice.authorRole})
          </div>
          <div style={{ display: 'flex', gap: '1.25rem' }}>
            <span>Reads: <strong>{notice.readCount || 0}</strong></span>
            <span>Likes: <strong>{likeCount}</strong></span>
          </div>
        </div>

        {/* Notice Content */}
        <div style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-main)', whiteSpace: 'pre-line', marginBottom: '2rem' }}>
          {notice.content}
        </div>

        {/* Attachments Section */}
        {notice.attachments && notice.attachments.length > 0 && (
          <div style={{ marginBottom: '2rem', padding: '1.25rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Attached Documents ({notice.attachments.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {notice.attachments.map((att) => (
                <div key={att.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    📄 {att.originalFileName} ({Math.round((att.fileSize || 0) / 1024)} KB)
                  </span>
                  <a
                    href={`${process.env.REACT_APP_API_URL || 'http://localhost:8080/api'}/files/download/${att.id}`}
                    className="btn btn-secondary btn-sm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions bar (Like, Edit) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            className={`btn ${liked ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleLike}
            disabled={liked}
          >
            {liked ? '❤️ Liked' : '🤍 Like Notice'} ({likeCount})
          </button>

          {canEdit && (
            <Link to={`/teacher/edit-notice/${notice.id}`} className="btn btn-secondary">
              Edit Notice
            </Link>
          )}
        </div>

        {/* Upload attachment if authorized */}
        {canEdit && (
          <AttachmentUpload noticeId={notice.id} onUploadSuccess={fetchNotice} />
        )}

        {/* Comments section */}
        <CommentSection noticeId={notice.id} />
      </div>
    </div>
  );
};

export default NoticeDetails;
