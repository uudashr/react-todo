import React from 'react';
import PropTypes from 'prop-types';

import { 
  Row, 
  Col, 
  Space,
  message,
  Divider
} from 'antd';

import TaskForm from './component/TaskForm';
import TaskList from './component/TaskList';

import './App.css';

function App(props) {
  const {taskClient} = props;
  
  const [outstandingTasks, setOutstandingTasks] = React.useState([]);
  const [outstandingTasksLoading, setOutstandingTasksLoading] = React.useState(false);

  const [completedTasks, setCompletedTasks] = React.useState([]);
  const [completedTasksLoading, setCompletedTasksLoading] = React.useState(false);

  const handleAddTask = async (name, done) => {
    if (!taskClient) {
      done();
      return;
    }

    try {
      await taskClient.addTask(name);
      const [tempOutstandingTasks, tempCompletedTasks] = await Promise.all([taskClient.outstandingTasks(), taskClient.completedTasks()]);
      setOutstandingTasks(tempOutstandingTasks);
      setCompletedTasks(tempCompletedTasks);
      done();
      message.info('Task added');
    } catch (e) {
      done(e);
      message.error(e.message);
    }
  }

  const handleTaskStatusChange = async (task, done) => {
    if (!taskClient) {
      done();
      return;
    }

    try {
      await taskClient.updateTaskStatus(task.id, task.completed);
      const [tempOutstandingTasks, tempCompletedTasks] = await Promise.all([taskClient.outstandingTasks(), taskClient.completedTasks()]);
      setOutstandingTasks(tempOutstandingTasks);
      setCompletedTasks(tempCompletedTasks);
      done();
      message.info('Task updated');
    } catch (e) {
      done(e);
      message.error(e.message);
    }
  }

  React.useEffect(() => {
    if (!taskClient) {
      return;
    }

    const loadData = async () => {
      setOutstandingTasksLoading(true);
      try {
        setOutstandingTasks(await taskClient.outstandingTasks());
      } catch (e) {
        message.error(e.message);
      } finally {
        setOutstandingTasksLoading(false);
      }
    };

    loadData()
  }, [taskClient]);

  React.useEffect(() => {
    if (!taskClient) {
      return;
    }

    const loadData = async () => {
      setCompletedTasksLoading(true);
      try {
        setCompletedTasks(await taskClient.completedTasks());
      } catch (e) {
        message.error(e.message);
      } finally {
        setCompletedTasksLoading(false);
      }
    };

    loadData();
  }, [taskClient]);

  return (
    <Row
      type='flex'
      justify='center'
      style={{ minHeight: '50vh', padding: '5rem' }}
    >
      <Col>
        <Space direction='vertical'>
          <TaskForm 
            onAdd={handleAddTask}
          />
          <TaskList 
            title='Tasks'
            tasks={outstandingTasks}
            loading={outstandingTasksLoading}
            onItemStatusChange={handleTaskStatusChange}
          />
          <Divider plain dashed>Completed tasks</Divider>
          <TaskList
            tasks={completedTasks}
            loading={completedTasksLoading}
            onItemStatusChange={handleTaskStatusChange}
          />
        </Space>
      </Col>
    </Row>
  );
}

App.propTypes = {
  taskClient: PropTypes.object,
};

export default App;