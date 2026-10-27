import React, { useState, useEffect } from 'react';
import * as categoryService from '../services/categoryService';
import { ENGINEERING_DEPARTMENTS } from '../services/departmentConstants';

const NoticeFilter = ({ onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const cats = await categoryService.getAllCategories().catch(() => []);
        if (isMounted && cats && cats.length > 0) {
          setCategories(cats);
        }
      } catch (e) {
        console.error('Error fetching categories', e);
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    triggerFilter(val, selectedDepartment, selectedPriority);
  };

  const handleDepartmentChange = (e) => {
    const val = e.target.value;
    setSelectedDepartment(val);
    triggerFilter(selectedCategory, val, selectedPriority);
  };

  const handlePriorityChange = (e) => {
    const val = e.target.value;
    setSelectedPriority(val);
    triggerFilter(selectedCategory, selectedDepartment, val);
  };

  const triggerFilter = (category, department, priority) => {
    if (onFilterChange) {
      onFilterChange({
        category: category || null,
        department: department || null,
        priority: priority || null,
      });
    }
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedDepartment('');
    setSelectedPriority('');
    if (onFilterChange) {
      onFilterChange({ category: null, department: null, priority: null });
    }
  };

  const hasActiveFilters = Boolean(selectedCategory || selectedDepartment || selectedPriority);

  return (
    <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h4
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Filter Notices
          </h4>
          {hasActiveFilters && (
            <span className="badge badge-category" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
              Active
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={resetFilters}
            style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
        {/* Category Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label
            className="form-label"
            htmlFor="filter-category"
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}
          >
            Category
          </label>
          <select
            id="filter-category"
            className="form-control"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.categoryName} value={c.id || c.categoryName}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label
            className="form-label"
            htmlFor="filter-department"
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}
          >
            Department
          </label>
          <select
            id="filter-department"
            className="form-control"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            <option value="">All Departments</option>
            {ENGINEERING_DEPARTMENTS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label
            className="form-label"
            htmlFor="filter-priority"
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}
          >
            Priority
          </label>
          <select
            id="filter-priority"
            className="form-control"
            value={selectedPriority}
            onChange={handlePriorityChange}
          >
            <option value="">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default NoticeFilter;
