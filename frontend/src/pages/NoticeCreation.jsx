import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddNotice from '../components/AddNotice';

const NoticeCreation = () => {
  const navigate = useNavigate();

  const handleNoticeAdded = () => {
    // Optional delay or direct navigation
  };

  return (
    <div className="container-narrow">
      <div style={{ marginBottom: '1.25rem' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </button>
      </div>

      <AddNotice onNoticeAdded={handleNoticeAdded} />
    </div>
  );
};

export default NoticeCreation;
