import React from 'react';
import PropTypes from 'prop-types';

import { List, Typography } from "antd";
import TaskListItem from './TaskListItem';

const { Title } = Typography;

function TaskList(props) {
  const {title, loading, tasks, onItemStatusChange, onItemDelete} = props;
  
  const header = title ? <Title level={4}>{title}</Title> : undefined;

  return (
    <List
      style={{ minWidth: '30rem' }}
      bordered
      loading={loading}
      header={header}
      dataSource={tasks}
      renderItem={task => (
        <TaskListItem
          key={task.id} 
          task={task} 
          onStatusChange={onItemStatusChange} 
          onDeleteClick={onItemDelete}
        />
      )} />
  );
}

TaskList.propTypes = {
  title : PropTypes.string, 
  loading: PropTypes.bool, 
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    completed: PropTypes.bool
  })),
  onStatusChange: PropTypes.func,
  onItemDelete: PropTypes.func
};

export default TaskList;