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

describe('TaskListItem with outstanding task', () => {
  const setup = () => {
    const task = {
      id: 10,
      name: 'Learn React JS',
      completed: false
    };

    const handleStatusChange = jest.fn();
    const handleDelete = jest.fn();

    render(
      <TaskListItem 
        task={task} 
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
    );

    return { task, handleStatusChange, handleDelete };
  };

  it('renders task', () => {
    const { task } = setup();

    const item = screen.getByText(task.name);
    expect(item).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('click checkbox', () => {
    const { handleStatusChange } = setup();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeEnabled();
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(handleStatusChange).toBeCalled();
    const [taskArg, doneArg] = handleStatusChange.mock.calls[0];
    expect(taskArg.completed).toEqual(true);
    expect(checkbox).toBeDisabled();
    act(() => doneArg());
  });

  test('click delete', () => {
    const { task, handleDelete } = setup();

    const checkbox = screen.getByRole('checkbox');
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

describe('TaskListItem with completed task', () => {
  const setup = () => {
    const task = {
      id: 10,
      name: 'Learn React JS',
      completed: true
    };

    const handleStatusChange = jest.fn();
    const handleDelete = jest.fn();

    render(
      <TaskListItem 
        task={task} 
        onStatusChange={handleStatusChange} 
        onDelete={handleDelete}
      />
    );

    return { task, handleStatusChange, handleDelete };
  };

  it('renders task', () => {
    const { task } = setup();

    const item = screen.getByText(task.name);
    expect(item).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('click checkbox', () => {
    const { task, handleStatusChange } = setup();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeEnabled();
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(handleStatusChange).toBeCalled();
    const [taskArg, doneArg] = handleStatusChange.mock.calls[0];
    expect(taskArg.id).toEqual(task.id);
    expect(taskArg.completed).toEqual(false);
    expect(checkbox).toBeDisabled();
    act(() => doneArg());
  });

  test('click delete', () => {
    const { task, handleDelete } = setup();

    const checkbox = screen.getByRole('checkbox');
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