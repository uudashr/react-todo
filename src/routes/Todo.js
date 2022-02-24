import React from 'react';
import PropTypes from 'prop-types';

import { 
  Row, Col, 
  Space,
  message,
  Divider,
  Typography,
  Button,
} from 'antd';

import {
  BookFilled
} from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';

import './Todo.css';
import { useAuth } from '../auth';

const { Title } = Typography;

function Todo(props) {
  const {taskClient} = props;
  
  const [outstandingTasks, setOutstandingTasks] = React.useState([]);
  const [outstandingTasksLoading, setOutstandingTasksLoading] = React.useState(false);

  const [completedTasks, setCompletedTasks] = React.useState([]);
  const [completedTasksLoading, setCompletedTasksLoading] = React.useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

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
      // TODO: capture Unauthorized and sign out
      message.error(e.message);
    }
  };

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
      // TODO: capture Unauthorized and sign out
      message.error(e.message);
    }
  };

  const handleLogOut = () => {
    auth.signOut();
    message.info('Logged out');
    navigate('/login', { replace: true });
  };

  React.useEffect(() => {
    if (!taskClient) {
      return;
    }

    let canceled = false;
    const loadData = async () => {
      if (!canceled) {
        setOutstandingTasksLoading(true);
      }
      try {
        const tempTasks = await taskClient.outstandingTasks()
        if (!canceled) {
          setOutstandingTasks(tempTasks);
        }
      } catch (e) {
        if (!canceled) {
          message.error(e.message);
        }
        // TODO: capture Unauthorized and sign out
      } finally {
        if (!canceled) {
          setOutstandingTasksLoading(false);
        }
      }
    };

    loadData()
    return () => {
      canceled = true;
    };
  }, [taskClient]);

  React.useEffect(() => {
    if (!taskClient) {
      return;
    }

    let canceled = false;
    const loadData = async () => {
      if (!canceled) {
        setCompletedTasksLoading(true);
      }
      try {
        const tempTasks = await taskClient.completedTasks()
        if (!canceled) {
          setCompletedTasks(tempTasks);
        }
      } catch (e) {
        if (!canceled) {
          message.error(e.message);
        }
        // TODO: capture Unauthorized and sign out
      } finally {
        if (!canceled) {
          setCompletedTasksLoading(false);
        }
      }
    };

    loadData();
    return () => {
      canceled = true;
    };
  }, [taskClient]);

  return (
    <Row
      type='flex'
      justify='center'
      style={{ minHeight: '50vh', padding: '5rem' }}
    >
      <Col>
        <Space direction='vertical'>
          <Row wrap={false} align='middle'>
            <Col flex='auto'>
              <Title>
                <BookFilled /> Todo
              </Title>
            </Col>
            <Col flex='none'>
              <Button type='link' danger onClick={handleLogOut}>Log out</Button>
            </Col>
          </Row>
          
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

Todo.propTypes = {
  taskClient: PropTypes.object,
};

export default Todo;