import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ViewNotices from '../components/ViewNotices';
import { AuthProvider } from '../contexts/AuthContext';

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
};

describe('ViewNotices Component', () => {
  test('displays "No notices available" when notice list is empty', () => {
    renderWithProviders(<ViewNotices customNotices={[]} />);
    expect(screen.getByText('No notices available')).toBeInTheDocument();
  });

  test('displays notices when data exists', () => {
    const mockNotices = [
      {
        id: 1,
        title: 'Midterm Timetable',
        content: 'Schedule for mid terms is out.',
        categoryName: 'Examinations',
        priority: 'HIGH',
        publishDate: '2026-08-25T10:00:00',
        authorName: 'Prof. Davis',
      },
      {
        id: 2,
        title: 'Sports Gala 2026',
        content: 'Sign up for athletic sports.',
        categoryName: 'Sports & Activities',
        priority: 'MEDIUM',
        publishDate: '2026-08-26T10:00:00',
        authorName: 'Coach Mike',
      },
    ];

    renderWithProviders(<ViewNotices customNotices={mockNotices} />);

    expect(screen.getByText('Midterm Timetable')).toBeInTheDocument();
    expect(screen.getByText('Sports Gala 2026')).toBeInTheDocument();
    expect(screen.getByText('Examinations')).toBeInTheDocument();
    expect(screen.getByText('Sports & Activities')).toBeInTheDocument();
  });
});
