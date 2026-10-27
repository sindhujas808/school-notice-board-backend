import React, { useState, useEffect, useCallback } from 'react';
import ViewNotices from '../components/ViewNotices';
import NoticeSearch from '../components/NoticeSearch';
import NoticeFilter from '../components/NoticeFilter';
import * as noticeService from '../services/noticeService';
import { matchesDepartmentFilter } from '../services/departmentConstants';

const PublicNoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: null, department: null, priority: null, keyword: '' });

  const loadNotices = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      const isNumCategory = filters.category && !isNaN(Number(filters.category));

      if (filters.keyword) {
        data = await noticeService.searchNotices({
          keyword: filters.keyword || undefined,
          categoryId: isNumCategory ? Number(filters.category) : undefined,
          size: 50,
        });
      } else if (filters.category && isNumCategory) {
        data = await noticeService.getPublicNotices({
          category: Number(filters.category),
          size: 50,
        });
      } else {
        data = await noticeService.getPublicNotices({ size: 50 });
      }

      let list = data && data.content ? data.content : [];

      // Filter by department
      if (filters.department) {
        list = list.filter((n) => matchesDepartmentFilter(n, filters.department));
      }

      // Filter by category (if string name)
      if (filters.category && !isNumCategory) {
        list = list.filter(
          (n) => n.categoryName && n.categoryName.toLowerCase() === String(filters.category).toLowerCase()
        );
      }

      // Filter by priority
      if (filters.priority) {
        list = list.filter((n) => n.priority === filters.priority);
      }

      setNotices(list);
    } catch (e) {
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const handleSearch = (keyword) => {
    setFilters((prev) => ({ ...prev, keyword }));
  };

  const handleFilterChange = (filterValues) => {
    setFilters((prev) => ({ ...prev, ...filterValues }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Hero Welcome Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          color: '#ffffff',
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 8px 24px -4px rgba(30, 27, 75, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: '#e0e7ff',
              marginBottom: '1rem',
            }}
          >
            <span>📢</span> Official Announcements & Circulars
          </div>

          <h1
            style={{
              color: '#ffffff',
              fontSize: '2.25rem',
              fontWeight: 800,
              lineHeight: '1.25',
              marginBottom: '0.85rem',
              letterSpacing: '-0.02em',
            }}
          >
            School Notice & Bulletin Board
          </h1>

          <p
            style={{
              color: '#c7d2fe',
              fontSize: '1.05rem',
              lineHeight: '1.6',
              maxWidth: '680px',
            }}
          >
            Centralized platform for official school announcements, examination timetables, academic schedules, and departmental circulars in real time.
          </p>
        </div>
      </section>

      {/* Search Bar Section */}
      <div>
        <NoticeSearch onSearch={handleSearch} />
      </div>

      {/* Filter Section */}
      <NoticeFilter onFilterChange={handleFilterChange} />

      {/* Notices Feed Section */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)' }}>
              Published Notices {!loading && `(${notices.length})`}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing verified announcements across departments
            </p>
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading notices...</p>
          </div>
        ) : (
          <ViewNotices customNotices={notices} />
        )}
      </div>
    </div>
  );
};

export default PublicNoticeBoard;
