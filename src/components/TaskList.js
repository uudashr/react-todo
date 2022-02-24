import React from 'react';
import PropTypes from 'prop-types';

import { List, Typography } from "antd";
import TaskListItem from './TaskListItem';

const { Title } = Typography;

function TaskList(props) {

  const {title, onItemStatusChange, loading, tasks} = props;
  
  const handleItemStatusChange = (task, done) => { // task{id, completed}, done(err)
    if (!onItemStatusChange) {
      return
    }
    
    onItemStatusChange(task, done);
  };

  const header = title ? <Title level={4}>{title}</Title> : undefined;

  return (
    <List
      style={{ minWidth: '30rem' }}
      bordered
      loading={loading}
      header={header}
      dataSource={tasks}
      renderItem={(task) => (
        <TaskListItem key={task.id} task={task} onStatusChange={handleItemStatusChange} />
      )} />
  );
}

TaskList.propTypes = {
  title : PropTypes.string, 
  onItemStatusChange: PropTypes.func, 
  loading: PropTypes.bool, 
  tasks: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    completed: PropTypes.bool
  }))
};

export default TaskList;