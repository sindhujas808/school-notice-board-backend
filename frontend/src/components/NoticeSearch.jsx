import React, { useState } from 'react';

const NoticeSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        display: 'flex',
        gap: '0.65rem',
        width: '100%',
        alignItems: 'center',
      }}
    >
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search notices by title, keywords, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            paddingLeft: '2.5rem',
            paddingRight: searchTerm ? '2.5rem' : '1rem',
          }}
          aria-label="Search notices"
        />
        <span
          style={{
            position: 'absolute',
            left: '0.85rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-light)',
            fontSize: '0.95rem',
            pointerEvents: 'none',
          }}
        >
          🔍
        </span>
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              padding: '0.2rem',
            }}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ minWidth: '110px' }}
      >
        Search
      </button>

      {searchTerm && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClear}
        >
          Reset
        </button>
      )}
    </form>
  );
};

export default NoticeSearch;
