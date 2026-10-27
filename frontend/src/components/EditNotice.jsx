import React, { useState, useEffect } from 'react';
import * as noticeService from '../services/noticeService';
import * as categoryService from '../services/categoryService';
import * as departmentService from '../services/departmentService';

const EditNotice = ({ noticeId, initialData, onNoticeUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    noticeTitle: '',
    noticeContent: '',
    noticeDate: '',
    noticeCategory: '',
    departmentId: '',
    priority: 'MEDIUM',
    audienceType: 'PUBLIC',
    targetRoles: ['STUDENT', 'PARENT', 'TEACHER'],
    isPinned: false,
  });

  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, depts] = await Promise.all([
          categoryService.getAllCategories(),
          departmentService.getAllDepartments().catch(() => []),
        ]);
        setCategories(cats || []);
        setDepartments(depts || []);
      } catch (e) {
        setCategories([]);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        noticeTitle: initialData.title || '',
        noticeContent: initialData.content || '',
        noticeDate: initialData.publishDate ? initialData.publishDate.split('T')[0] : '',
        noticeCategory: initialData.categoryName || '',
        departmentId: initialData.departmentId || '',
        priority: initialData.priority || 'MEDIUM',
        audienceType: initialData.audienceType || 'PUBLIC',
        targetRoles: initialData.targetRoles || ['STUDENT', 'PARENT', 'TEACHER'],
        isPinned: initialData.isPinned || false,
      });
    } else if (noticeId) {
      const fetchNotice = async () => {
        try {
          const notice = await noticeService.getNoticeById(noticeId);
          if (notice) {
            setFormData({
              noticeTitle: notice.title || '',
              noticeContent: notice.content || '',
              noticeDate: notice.publishDate ? notice.publishDate.split('T')[0] : '',
              noticeCategory: notice.categoryName || '',
              departmentId: notice.departmentId || '',
              priority: notice.priority || 'MEDIUM',
              audienceType: notice.audienceType || 'PUBLIC',
              targetRoles: notice.targetRoles || ['STUDENT', 'PARENT', 'TEACHER'],
              isPinned: notice.isPinned || false,
            });
          }
        } catch (e) {
          setError(e.response?.data?.message || 'Failed to load notice details.');
        }
      };
      fetchNotice();
    }
  }, [noticeId, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleToggle = (role) => {
    setFormData((prev) => {
      const current = prev.targetRoles || [];
      const updated = current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role];
      return { ...prev, targetRoles: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { noticeTitle, noticeContent, noticeDate, noticeCategory } = formData;
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      setError('Notice title and content cannot be blank.');
      return;
    }

    setLoading(true);
    const targetId = noticeId || (initialData && initialData.id);
    try {
      const payload = {
        title: noticeTitle.trim(),
        content: noticeContent.trim(),
        categoryName: noticeCategory,
        departmentId: formData.departmentId ? Number(formData.departmentId) : null,
        publishDate: noticeDate ? `${noticeDate}T00:00:00` : null,
        priority: formData.priority,
        audienceType: formData.audienceType,
        targetRoles: formData.audienceType === 'ROLE_BASED' ? formData.targetRoles : undefined,
        isPinned: formData.isPinned,
      };

      const updated = await noticeService.updateNotice(targetId, payload);
      setMessage('Notice updated successfully!');

      if (onNoticeUpdated) {
        onNoticeUpdated(updated);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.data?.data && typeof err.response.data.data === 'object'
          ? Object.values(err.response.data.data).join(', ')
          : null) ||
        err.message ||
        'Failed to update notice.';
      setError(`Notice update failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2>Edit Notice</h2>
        {onCancel && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="editNoticeTitle">
            Notice Title *
          </label>
          <input
            id="editNoticeTitle"
            type="text"
            name="noticeTitle"
            className="form-control"
            value={formData.noticeTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label" htmlFor="editNoticeCategory">
              Category
            </label>
            <select
              id="editNoticeCategory"
              name="noticeCategory"
              className="form-control"
              value={formData.noticeCategory}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id || cat.categoryName} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="editDepartmentId">
              Department
            </label>
            <select
              id="editDepartmentId"
              name="departmentId"
              className="form-control"
              value={formData.departmentId}
              onChange={handleChange}
            >
              <option value="">Campus-Wide / All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code ? `[${d.code}] ` : ''}{d.departmentName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label" htmlFor="editNoticeDate">
              Publish Date
            </label>
            <input
              id="editNoticeDate"
              type="date"
              name="noticeDate"
              className="form-control"
              value={formData.noticeDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="editPriority">
              Priority Level
            </label>
            <select
              id="editPriority"
              name="priority"
              className="form-control"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="editAudienceType">
            Audience Type
          </label>
          <select
            id="editAudienceType"
            name="audienceType"
            className="form-control"
            value={formData.audienceType}
            onChange={handleChange}
          >
            <option value="PUBLIC">Public</option>
            <option value="ROLE_BASED">Role-Based</option>
            <option value="DEPARTMENT_ONLY">Department Only</option>
          </select>
        </div>

        {formData.audienceType === 'ROLE_BASED' && (
          <div className="form-group" style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <label className="form-label" style={{ marginBottom: '0.4rem' }}>Select Target Roles:</label>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              {['STUDENT', 'PARENT', 'TEACHER'].map((role) => (
                <label key={role} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={(formData.targetRoles || []).includes(role)}
                    onChange={() => handleRoleToggle(role)}
                  />
                  {role}
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="editNoticeContent">
            Notice Content *
          </label>
          <textarea
            id="editNoticeContent"
            name="noticeContent"
            className="form-control"
            rows="6"
            value={formData.noticeContent}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              name="isPinned"
              checked={formData.isPinned}
              onChange={handleChange}
            />
            📌 Pin Notice
          </label>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {onCancel && (
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Update Notice'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditNotice;
