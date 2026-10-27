import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddNotice from '../components/AddNotice';
import * as noticeService from '../services/noticeService';
import * as categoryService from '../services/categoryService';
import * as departmentService from '../services/departmentService';

jest.mock('../services/noticeService');
jest.mock('../services/categoryService');
jest.mock('../services/departmentService');

describe('AddNotice Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    categoryService.getAllCategories.mockResolvedValue([
      { id: 1, categoryName: 'Academic' },
      { id: 2, categoryName: 'Examinations' },
    ]);
    departmentService.getAllDepartments.mockResolvedValue([
      { id: 1, code: 'CSE', departmentName: 'Computer Science & Engineering' },
    ]);
  });

  test('renders all form fields and submit button', async () => {
    render(<AddNotice />);
    await waitFor(() => expect(categoryService.getAllCategories).toHaveBeenCalled());

    expect(screen.getByLabelText(/Notice Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Publish Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notice Content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Publish Notice/i })).toBeInTheDocument();
  });

  test('shows validation message when title is empty', async () => {
    render(<AddNotice />);
    await waitFor(() => expect(categoryService.getAllCategories).toHaveBeenCalled());

    const submitBtn = screen.getByRole('button', { name: /\+ Publish Notice/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Notice title cannot be blank/i)).toBeInTheDocument();
  });

  test('successfully submits notice and displays success message', async () => {
    noticeService.addNotice.mockResolvedValue({ id: 1, title: 'Annual Sports Day' });
    const onAddedMock = jest.fn();

    render(<AddNotice onNoticeAdded={onAddedMock} />);
    expect(await screen.findByRole('option', { name: 'Academic' })).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Notice Title/i);
    const contentInput = screen.getByLabelText(/Notice Content/i);
    const dateInput = screen.getByLabelText(/Publish Date/i);
    const categorySelect = screen.getByLabelText(/Category/i);

    fireEvent.change(titleInput, { target: { name: 'noticeTitle', value: 'Annual Sports Day' } });
    fireEvent.change(contentInput, { target: { name: 'noticeContent', value: 'All track events will start at 8 AM.' } });
    fireEvent.change(dateInput, { target: { name: 'noticeDate', value: '2026-09-01' } });
    fireEvent.change(categorySelect, { target: { name: 'noticeCategory', value: 'Academic' } });

    const submitBtn = screen.getByRole('button', { name: /\+ Publish Notice/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Notice created and published successfully!')).toBeInTheDocument();
    expect(noticeService.addNotice).toHaveBeenCalledWith({
      title: 'Annual Sports Day',
      content: 'All track events will start at 8 AM.',
      categoryName: 'Academic',
      departmentId: null,
      publishDate: '2026-09-01T00:00:00',
      priority: 'MEDIUM',
      audienceType: 'PUBLIC',
      targetRoles: undefined,
      isPinned: false,
    });
    expect(onAddedMock).toHaveBeenCalled();
  });

  test('displays failure message when API call fails', async () => {
    noticeService.addNotice.mockRejectedValue(new Error('Server Error'));

    render(<AddNotice />);
    await waitFor(() => expect(categoryService.getAllCategories).toHaveBeenCalled());

    const titleInput = screen.getByLabelText(/Notice Title/i);
    const contentInput = screen.getByLabelText(/Notice Content/i);
    const dateInput = screen.getByLabelText(/Publish Date/i);
    const categorySelect = screen.getByLabelText(/Category/i);

    fireEvent.change(titleInput, { target: { name: 'noticeTitle', value: 'Test Notice' } });
    fireEvent.change(contentInput, { target: { name: 'noticeContent', value: 'Test Content' } });
    fireEvent.change(dateInput, { target: { name: 'noticeDate', value: '2026-09-01' } });
    fireEvent.change(categorySelect, { target: { name: 'noticeCategory', value: 'Academic' } });

    const submitBtn = screen.getByRole('button', { name: /\+ Publish Notice/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Notice creation failed: Server Error/i)).toBeInTheDocument();
  });
});
