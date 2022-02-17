import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import TaskListItem from './TaskListItem';

describe('TaskListItem with no task', () => {
  it('renders checkbox', () => {
    render(<TaskListItem />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });
});

describe('TaskListItem with completed task', () => {
  const task = {
    id: 10,
    name: 'Learn React JS',
    completed: true
  };

  const handleStatusChange = jest.fn();

  const setup = () => {
    render(
      <TaskListItem task={task} onStatusChange={handleStatusChange} />
    );
  };

  it('renders task', () => {
    setup();

    const item = screen.getByText(task.name);
    expect(item).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('click checkbox', () => {
    setup();

    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);

    expect(handleStatusChange).toBeCalledTimes(1);
    const [taskArg, doneArg] = handleStatusChange.mock.calls[0];
    expect(taskArg.completed).toEqual(false);
    act(() => doneArg());
  });
});

describe('TaskListItem with un-completed task', () => {
  const task = {
    id: 10,
    name: 'Learn React JS',
    completed: false
  };

  const setup = () => {
    const handleStatusChange = jest.fn();
    render(
      <TaskListItem task={task} onStatusChange={handleStatusChange} />
    );
    return {handleStatusChange};
  };

  it('renders task', () => {
    setup();

    const item = screen.getByText(task.name);
    expect(item).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('click checkbox', () => {
    const {handleStatusChange} = setup();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(handleStatusChange).toBeCalledTimes(1);
    const [taskArg, doneArg] = handleStatusChange.mock.calls[0];
    expect(taskArg.completed).toEqual(true);
    act(() => doneArg());
  });
});