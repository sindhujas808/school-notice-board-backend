import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: 'auto',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border)',
        padding: '1.75rem 0',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <p style={{ fontWeight: 500 }}>
          © {new Date().getFullYear()} <strong>NoticeHub</strong> • School Notice Board Management System. All rights reserved.
        </p>
        <p style={{ marginTop: '0.35rem', fontSize: '0.78rem', color: 'var(--text-light)' }}>
          Powered by Spring Boot 3 & React • Role-Based Access Control • High Performance Bulletin
        </p>
      </div>
    </footer>
  );
};

export default Footer;
