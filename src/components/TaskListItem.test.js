import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import TaskListItem from './TaskListItem';
import { act } from 'react-dom/test-utils';

describe('TaskListItem with no task', () => {
  it('renders checkbox', () => {
    render(<TaskListItem />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    const editButton = screen.getByRole('button', { name: 'Edit' })
    expect(editButton).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    expect(deleteButton).toBeInTheDocument();
  });
});

describe('TaskListItem with task', () => {
  const setup = (task) => {
    const handleStatusChange = jest.fn();
    const handleDelete = jest.fn();

    render(
      <TaskListItem 
        task={task} 
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    );

    return { handleStatusChange, handleDelete };
  };

  const testCases = [
    {
      name: 'uncompleted',
      task: {
        id: 10,
        name: 'Learn React JS',
        completed: false
      }
    },
    {
      name: 'uncompleted (completed var is undefined)',
      task: {
        id: 10,
        name: 'Learn React JS',
      }
    },
    {
      name: 'completed',
      task: {
        id: 10,
        name: 'Learn React JS',
        completed: true
      }
    }
  ]

  test.each(testCases)('renders on $name task', ({task}) => {
    setup(task);

    const checkbox = screen.getByRole('checkbox', { name: task.name });
    expect(checkbox.checked).toEqual(task.completed || false);
    

    const editButton = screen.getByRole('button', { name: 'Edit' })
    expect(editButton).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    expect(deleteButton).toBeInTheDocument();
  });

  test.each(testCases)('click checkbox on $name task', ({ task }) => {
    const { handleStatusChange } = setup(task);

    const { completed = false } = task;

    const checkbox = screen.getByRole('checkbox', { name: task.name });
    expect(checkbox).toBeEnabled();
    expect(checkbox.checked).toEqual(completed);

    fireEvent.click(checkbox);

    expect(handleStatusChange).toBeCalled();
    const [taskArg, doneArg] = handleStatusChange.mock.calls[0];
    expect(taskArg.completed).toEqual(!completed);
    expect(checkbox).toBeDisabled();
    act(() => doneArg());
  });

  test.each(testCases)('click delete on $name task', ({ task }) => {
    const { handleDelete } = setup(task);

    const checkbox = screen.getByRole('checkbox', { name: task.name});
    const editButton = screen.getByRole('button', { name: 'Edit' });
    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    
    expect(checkbox).toBeEnabled();
    expect(editButton).toBeEnabled();
    expect(deleteButton).toBeEnabled();
    
    fireEvent.click(deleteButton);

    expect(handleDelete).toBeCalled();
    const [idArg, doneArg] = handleDelete.mock.calls[0];
    expect(idArg).toEqual(task.id);
    expect(checkbox).toBeDisabled();
    expect(editButton).toBeDisabled();
    act(() => doneArg());
  });
});