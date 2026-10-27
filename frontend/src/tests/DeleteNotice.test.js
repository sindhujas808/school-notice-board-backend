import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteNotice from '../components/DeleteNotice';
import * as noticeService from '../services/noticeService';

jest.mock('../services/noticeService');

describe('DeleteNotice Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('calls deleteNotice API and triggers callback on confirmation', async () => {
    noticeService.deleteNotice.mockResolvedValue({ success: true });
    const onDeleteSuccessMock = jest.fn();

    render(
      <DeleteNotice
        noticeId={5}
        noticeTitle="Old Timetable"
        onDeleteSuccess={onDeleteSuccessMock}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText(/Old Timetable/i)).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', { name: /Delete Notice/i });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(noticeService.deleteNotice).toHaveBeenCalledWith(5);
      expect(onDeleteSuccessMock).toHaveBeenCalledWith(5);
    });
  });

  test('handles cancellation properly', () => {
    const onCancelMock = jest.fn();

    render(
      <DeleteNotice
        noticeId={5}
        noticeTitle="Old Timetable"
        onDeleteSuccess={jest.fn()}
        onCancel={onCancelMock}
      />
    );

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(onCancelMock).toHaveBeenCalled();
  });
});
