import React, { useState } from 'react';
import * as noticeService from '../services/noticeService';

const DeleteNotice = ({ noticeId, noticeTitle, onDeleteSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await noticeService.deleteNotice(noticeId);
      if (onDeleteSuccess) {
        onDeleteSuccess(noticeId);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete notice. Please try again.';
      setError(`Deletion failed: ${errorMsg}`);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div className="card" style={{ maxWidth: '480px', width: '100%' }}>
        <h3 style={{ marginBottom: '0.75rem', color: 'var(--danger)' }}>Confirm Deletion</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Are you sure you want to delete the notice{' '}
          <strong>"{noticeTitle || 'Selected Notice'}"</strong>? This action cannot be undone.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Notice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteNotice;
