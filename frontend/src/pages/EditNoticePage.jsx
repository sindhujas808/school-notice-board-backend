import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditNotice from '../components/EditNotice';

const EditNoticePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container-narrow">
      <div style={{ marginBottom: '1.25rem' }}>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <EditNotice
        noticeId={id}
        onNoticeUpdated={() => navigate(`/notices/${id}`)}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
};

export default EditNoticePage;
