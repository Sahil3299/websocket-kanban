import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TaskProvider } from '../../context/TaskContext';
import KanbanBoard from '../../components/KanbanBoard';
import { socket } from '../../services/socket';

// Mock socket.io
vi.mock('../../services/socket', () => ({
  socket: {
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    connected: true
  }
}));

describe('WebSocket Integration', () => {
  beforeEach(() => {
    socket.on.mockClear();
    socket.emit.mockClear();
  });

  it('syncs tasks on connection', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', column: 'todo' },
      { id: '2', title: 'Task 2', column: 'inprogress' }
    ];

    // Simulate receiving tasks from server
    socket.on.mockImplementation((event, callback) => {
      if (event === 'sync:tasks') {
        callback(mockTasks);
      }
    });

    render(
      <TaskProvider>
        <KanbanBoard />
      </TaskProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('emits task creation event', async () => {
    const user = userEvent.setup();
    render(
      <TaskProvider>
        <KanbanBoard />
      </TaskProvider>
    );

    const newTaskButton = screen.getByText('+ New Task');
    await user.click(newTaskButton);

    const titleInput = screen.getByPlaceholderText('Task title');
    const submitButton = screen.getByText('Create Task');

    await user.type(titleInput, 'New Test Task');
    await user.click(submitButton);

    expect(socket.emit).toHaveBeenCalledWith(
      'task:create',
      expect.objectContaining({ title: 'New Test Task' })
    );
  });
});