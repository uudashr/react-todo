import React from 'react';
import PropTypes from 'prop-types';

import { List, Typography } from "antd";
import TaskListItem from './TaskListItem';

const { Title } = Typography;

function TaskList(props) {

  const {title, loading, tasks, onItemStatusChange, onItemDelete} = props;
  
  const handleItemStatusChange = (task, done) => { // task{id, completed}, done(err)
    if (!onItemStatusChange) {
      return;
    }
    
    onItemStatusChange(task, done);
  };

  const handleItemDelete = (id, done) => {
    if (!onItemDelete) {
      return;
    }

    onItemDelete(id, done);
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
        <TaskListItem 
          key={task.id} 
          task={task} 
          onStatusChange={handleItemStatusChange} 
          onDeleteClick={handleItemDelete}
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
  onItemDelete: PropTypes.func
};

export default TaskList;