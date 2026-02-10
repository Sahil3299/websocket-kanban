import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Task from '../../components/Task';

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  column: 'todo',
  priority: 'high',
  category: 'feature',
  attachments: [],
  assignee: 'John Doe'
};

describe('Task Component', () => {
  it('renders task correctly', () => {
    render(<Task task={mockTask} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('feature')).toBeInTheDocument();
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<Task task={mockTask} />);
    
    const editButton = screen.getByText('✏️');
    await user.click(editButton);
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('calls delete with confirmation', async () => {
    window.confirm = vi.fn(() => true);
    const user = userEvent.setup();
    
    render(<Task task={mockTask} />);
    
    const deleteButton = screen.getByText('🗑️');
    await user.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');
  });
});