import React from 'react';

const AboutPage = () => {
  return (
    <div className="container-narrow">
      <div className="card">
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>About School Notice Board System</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.5rem', lineHeight: '1.7' }}>
          The <strong>School Notice Board Management System</strong> is an enterprise-grade digital communication platform designed to streamline announcement dissemination, improve school-to-student engagement, and automate multi-channel notifications.
        </p>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', marginTop: '1.5rem' }}>Core Capabilities</h3>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <li><strong>Role-Based Access Control:</strong> Distinct access hierarchies for Administrators, Faculty/Teachers, Students, and Parents.</li>
          <li><strong>Audience Targeting:</strong> Broadcast publicly or target specific departments and student cohorts.</li>
          <li><strong>JPQL High-Performance Queries:</strong> Optimized indexing and multi-criteria active notice filtering.</li>
          <li><strong>Real-time Analytics Dashboard:</strong> Live insights into department notice productivity and category engagement.</li>
          <li><strong>Secure Attachments:</strong> Supporting syllabi, schedules, and circular documents up to 50MB per file.</li>
          <li><strong>Audit Trail Logging:</strong> Complete tracking of logins, notice publications, updates, and moderation actions.</li>
        </ul>

        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Architecture & Stack</h3>
        <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <strong>Backend</strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Java 17, Spring Boot 3, Spring Security, Hibernate ORM, MySQL, JWT (JJWT), Maven.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <strong>Frontend</strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              React 18, React Router v6, Axios, Vanilla CSS Design System, Jest, React Testing Library.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
