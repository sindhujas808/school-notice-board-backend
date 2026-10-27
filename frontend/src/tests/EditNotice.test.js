import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditNotice from '../components/EditNotice';
import * as noticeService from '../services/noticeService';
import * as categoryService from '../services/categoryService';

jest.mock('../services/noticeService');
jest.mock('../services/categoryService');

describe('EditNotice Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    categoryService.getAllCategories.mockResolvedValue([
      { id: 1, categoryName: 'Academic' },
      { id: 2, categoryName: 'Examinations' },
    ]);
  });

  test('loads existing notice and updates correctly', async () => {
    const initialData = {
      id: 10,
      title: 'Original Title',
      content: 'Original Content',
      categoryName: 'Academic',
      priority: 'MEDIUM',
      audienceType: 'PUBLIC',
      publishDate: '2026-08-25T00:00:00',
    };

    noticeService.updateNotice.mockResolvedValue({
      ...initialData,
      title: 'Updated Title',
    });

    const onUpdatedMock = jest.fn();

    render(<EditNotice initialData={initialData} onNoticeUpdated={onUpdatedMock} />);

    const titleInput = screen.getByLabelText(/Notice Title/i);
    expect(titleInput.value).toBe('Original Title');

    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    const submitBtn = screen.getByRole('button', { name: /Update Notice/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Notice updated successfully!')).toBeInTheDocument();
    expect(noticeService.updateNotice).toHaveBeenCalledWith(
      10,
      expect.objectContaining({
        title: 'Updated Title',
      })
    );
    expect(onUpdatedMock).toHaveBeenCalled();
  });
});
