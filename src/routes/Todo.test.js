import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { message } from 'antd';

import Todo from './Todo';

jest.mock('antd', () => {
  const originalModule = jest.requireActual('antd');

  return {
    ...originalModule,
    message: {
      ...originalModule.message,
      success: jest.fn(),
    }
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('Todo with taskClient', () => {
  const setup = () => {
    const outstandingTasks = [
      { id: 1, name: 'Follow up SRE Support' },
      { id: 2, name: 'Read IAM Service Spec' },
    ];
  
    const completedTasks = [
      { id: 3, name: 'Research chat protocols', completed: true },
    ];

    const taskClient = {
      outstandingTasks: jest.fn(() => Promise.resolve(outstandingTasks)),
      completedTasks: jest.fn(() => Promise.resolve(completedTasks)),
      addTask: jest.fn(),
      updateTaskStatus: jest.fn(),
      deleteTask: jest.fn()
    };

    render(
      <BrowserRouter>
        <Todo taskClient={taskClient} />
      </BrowserRouter>
    );
    return { taskClient, outstandingTasks, completedTasks };
  }

  it('renders outstanding tasks', async () => {
    const { taskClient, outstandingTasks } = setup();

    await waitFor(() => {
      expect(taskClient.outstandingTasks).toHaveBeenCalled();
    });

    outstandingTasks.forEach((task) => {
      const checkbox = screen.getByLabelText(task.name);
      expect(checkbox).not.toBeChecked();
    });
  });

  it('renders completed tasks', async () => {
    const { taskClient, completedTasks } = setup();

    await waitFor(() => {
      expect(taskClient.completedTasks).toHaveBeenCalled();
    });

    completedTasks.forEach((task) => {
      const checkbox = screen.getByLabelText(task.name);
      expect(checkbox).toBeChecked();
    });
  });

  test('click/check outstanding task', async () => {
    const { taskClient, outstandingTasks } = setup();

    await waitFor(() => {
      expect(taskClient.outstandingTasks).toHaveBeenCalled();
    });

    const task = outstandingTasks[0];
    const checkbox = screen.getByLabelText(task.name);
    expect(checkbox).not.toBeChecked();

    taskClient.updateTaskStatus.mockResolvedValue();
    fireEvent.click(checkbox);

    expect(taskClient.updateTaskStatus).toBeCalledWith(task.id, true);
    await waitFor(() => {
      expect(message.success).toBeCalledWith('Task updated');
    });
  });

  test('click/check completed task', async () => {
    const { taskClient, completedTasks } = setup();

    await waitFor(() => {
      expect(taskClient.completedTasks).toHaveBeenCalled();
    });

    const task = completedTasks[0];
    const checkbox = screen.getByLabelText(task.name);
    expect(checkbox).toBeChecked();
    expect(checkbox.checked).toEqual(true);

    taskClient.updateTaskStatus.mockResolvedValue();
    fireEvent.click(checkbox);

    expect(taskClient.updateTaskStatus).toBeCalledWith(task.id, false);
    await waitFor(() => {
      expect(message.success).toBeCalledWith('Task updated');
    });
  });

  test('add task', async () => {
    const { taskClient } = setup();

    const newTaskName = 'Create spec document';

    await waitFor(() => {
      expect(taskClient.outstandingTasks).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(taskClient.completedTasks).toHaveBeenCalled();
    });

    const taskNameInput = screen.getByPlaceholderText('Enter task name');
    const addTask = screen.getByRole('button', { name: 'Add task' });

    fireEvent.change(taskNameInput, { target: { value: newTaskName } });

    taskClient.addTask.mockResolvedValue();
    fireEvent.click(addTask);

    expect(taskClient.addTask).toBeCalledWith(newTaskName);

    await waitFor(() => {
      expect(taskClient.outstandingTasks).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(taskClient.completedTasks).toHaveBeenCalledTimes(2);
    });
    
    expect(message.success).toHaveBeenCalledWith('Task added');
  });

  test('delete task', async () => {
    const { taskClient, outstandingTasks } = setup();

    await waitFor(() => {
      expect(taskClient.outstandingTasks).toHaveBeenCalled();
    });

    const deleteButtons = screen.queryAllByRole('button', { name: 'Delete' });
    const deleteButton = deleteButtons[0];
    const task = outstandingTasks[0];

    taskClient.deleteTask.mockResolvedValue();
    fireEvent.click(deleteButton);

    expect(taskClient.deleteTask).toBeCalledWith(task.id);
    
    await waitFor(() => {
      expect(taskClient.outstandingTasks).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(taskClient.completedTasks).toHaveBeenCalledTimes(2);
    });

    expect(message.success).toHaveBeenCalledWith('Task deleted');
  })
});

describe('Todo with no taskClient', () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <Todo />
      </BrowserRouter>
    );
  }

  it('renders no tasks', async () => {
    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes).toHaveLength(0);
  });

  test('add task', async () => {
    setup();

    const newTaskName = 'Create spec document';

    const taskNameInput = screen.getByPlaceholderText('Enter task name');
    const addTask = screen.getByRole('button', { name: 'Add task' });

    fireEvent.change(taskNameInput, { target: { value: newTaskName } });

    fireEvent.click(addTask);

    expect(message.success).not.toHaveBeenCalledWith('Task added');
  });
});