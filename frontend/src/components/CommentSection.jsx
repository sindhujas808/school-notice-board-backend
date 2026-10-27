import React, { useState, useEffect } from 'react';
import * as commentService from '../services/commentService';
import { useAuth } from '../contexts/AuthContext';

const CommentSection = ({ noticeId }) => {
  const { user, isAdmin } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      const data = await commentService.getCommentsByNoticeId(noticeId);
      setComments(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (noticeId) {
      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noticeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError('');
    try {
      await commentService.addComment(noticeId, newComment.trim());
      setNewComment('');
      fetchComments();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to post comment.';
      setError(`Comment failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete comment.';
      setError(`Delete comment failed: ${errorMsg}`);
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        Comments & Discussion ({comments.length})
      </h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Leave a comment or question..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-sm" disabled={loading || !newComment.trim()}>
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Please log in to participate in the discussion.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {comments.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
            No comments yet. Be the first to start the discussion!
          </p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <div>
                  <strong>{c.userFullName || c.username}</strong>{' '}
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ({c.userRole}) • {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                {(isAdmin || (user && user.username === c.username)) && (
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '0.8rem', cursor: 'pointer' }}
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', whiteSpace: 'pre-line' }}>{c.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
