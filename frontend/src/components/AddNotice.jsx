import React, { useState, useEffect } from 'react';
import * as noticeService from '../services/noticeService';
import * as categoryService from '../services/categoryService';
import * as departmentService from '../services/departmentService';

const AddNotice = ({ onNoticeAdded }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    noticeTitle: '',
    noticeContent: '',
    noticeDate: todayStr,
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
    const fetchData = async () => {
      try {
        const [cats, depts] = await Promise.all([
          categoryService.getAllCategories(),
          departmentService.getAllDepartments().catch(() => []),
        ]);
        setCategories(cats || []);
        setDepartments(depts || []);
        if (cats && cats.length > 0) {
          setFormData((prev) => ({
            ...prev,
            noticeCategory: prev.noticeCategory || cats[0].categoryName,
          }));
        }
      } catch (e) {
        const defaultCats = [
          { id: 1, categoryName: 'General Announcements' },
          { id: 2, categoryName: 'Academic' },
          { id: 3, categoryName: 'Examinations' },
          { id: 4, categoryName: 'Events & Fest' },
          { id: 5, categoryName: 'Sports & Activities' },
        ];
        setCategories(defaultCats);
        setFormData((prev) => ({
          ...prev,
          noticeCategory: prev.noticeCategory || defaultCats[0].categoryName,
        }));
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, id, value, type, checked } = e.target;
    const fieldName = name || id;
    if (fieldName) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: type === 'checkbox' ? checked : value,
      }));
    }
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

    if (!noticeTitle.trim()) {
      setError('Notice title cannot be blank.');
      return;
    }
    if (!noticeContent.trim()) {
      setError('Notice content cannot be blank.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: noticeTitle.trim(),
        content: noticeContent.trim(),
        categoryName: noticeCategory || (categories[0]?.categoryName || 'General Announcements'),
        departmentId: formData.departmentId ? Number(formData.departmentId) : null,
        publishDate: noticeDate ? `${noticeDate}T00:00:00` : null,
        priority: formData.priority || 'MEDIUM',
        audienceType: formData.audienceType || 'PUBLIC',
        targetRoles: formData.audienceType === 'ROLE_BASED' ? formData.targetRoles : undefined,
        isPinned: formData.isPinned || false,
      };

      await noticeService.addNotice(payload);
      setMessage('Notice created and published successfully!');
      setFormData({
        noticeTitle: '',
        noticeContent: '',
        noticeDate: todayStr,
        noticeCategory: categories.length > 0 ? categories[0].categoryName : '',
        departmentId: '',
        priority: 'MEDIUM',
        audienceType: 'PUBLIC',
        targetRoles: ['STUDENT', 'PARENT', 'TEACHER'],
        isPinned: false,
      });

      if (onNoticeAdded) {
        onNoticeAdded();
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.data?.data && typeof err.response.data.data === 'object'
          ? Object.values(err.response.data.data).join(', ')
          : null) ||
        err.message ||
        'Notice creation failed: Server error';
      setError(`Notice creation failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.25rem' }}>Create New Notice</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="noticeTitle">
            Notice Title *
          </label>
          <input
            id="noticeTitle"
            type="text"
            name="noticeTitle"
            className="form-control"
            placeholder="Enter a descriptive title..."
            value={formData.noticeTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label" htmlFor="noticeCategory">
              Category
            </label>
            <select
              id="noticeCategory"
              name="noticeCategory"
              className="form-control"
              value={formData.noticeCategory}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <option key={cat.id || cat.categoryName} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="departmentId">
              Department
            </label>
            <select
              id="departmentId"
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
            <label className="form-label" htmlFor="noticeDate">
              Publish Date
            </label>
            <input
              id="noticeDate"
              type="date"
              name="noticeDate"
              className="form-control"
              value={formData.noticeDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="priority">
              Priority Level
            </label>
            <select
              id="priority"
              name="priority"
              className="form-control"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent (Red Alert)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="audienceType">
            Target Audience
          </label>
          <select
            id="audienceType"
            name="audienceType"
            className="form-control"
            value={formData.audienceType}
            onChange={handleChange}
          >
            <option value="PUBLIC">Public (Visible to All Users & Guests)</option>
            <option value="ROLE_BASED">Role Based (Specific Roles Only)</option>
            <option value="DEPARTMENT_ONLY">Department Only (Assigned Department)</option>
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
          <label className="form-label" htmlFor="noticeContent">
            Notice Content *
          </label>
          <textarea
            id="noticeContent"
            name="noticeContent"
            className="form-control"
            rows="6"
            placeholder="Write full notice announcements, guidelines, timetables, or instructions..."
            value={formData.noticeContent}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              name="isPinned"
              checked={formData.isPinned}
              onChange={handleChange}
            />
            📌 Pin to top of Notice Board
          </label>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Publishing Notice...' : '+ Publish Notice'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNotice;
