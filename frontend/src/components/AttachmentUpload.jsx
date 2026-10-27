import React, { useState } from 'react';
import * as noticeService from '../services/noticeService';

const AttachmentUpload = ({ noticeId, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 52428800) {
        setError('File exceeds 50MB limit.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selected);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const uploaded = await noticeService.uploadAttachment(noticeId, file);
      setSuccess('Attachment uploaded successfully!');
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess(uploaded);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to upload file.';
      setError(`Upload failed: ${errorMsg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
      <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>Add Attachment (PDF, DOCX, PNG, JPG - max 50MB)</h4>
      {error && <div className="alert alert-danger" style={{ padding: '0.5rem', fontSize: '0.85rem' }}>{error}</div>}
      {success && <div className="alert alert-success" style={{ padding: '0.5rem', fontSize: '0.85rem' }}>{success}</div>}

      <form onSubmit={handleUpload} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input type="file" onChange={handleFileChange} className="form-control" style={{ maxWidth: '300px' }} />
        <button type="submit" className="btn btn-secondary btn-sm" disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
    </div>
  );
};

export default AttachmentUpload;
