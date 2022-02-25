import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, List, Spin, Space, Button } from "antd";
import { LoadingOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import './TaskListItem.css';

function TaskListItem(props) {
  const { task, onStatusChange, onDeleteClick } = props;

  const [changingStatus, setChangingStatus] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const handleStatusChange = (completed) => {
    if (!task) {
      return;
    }

    if (!onStatusChange) {
      return;
    }

    setChangingStatus(true);
    onStatusChange({id: task.id, completed}, (err) => {
      if (err) {
        setChangingStatus(false);
      }
    });
  };

  const handleDelete = () => {
    if (!task) {
      return;
    }

    if (!onDeleteClick) {
      return;
    }

    setDeleting(true);
    onDeleteClick(task.id, (err) => {
      if (err) {
        setDeleting(false);
      }
    });
  };

  return (
    <List.Item className='hoverable'>
      <Checkbox
        style={{ width: '100%' }}
        disabled={changingStatus || deleting}
        checked={task?.completed || false}
        onChange={event => handleStatusChange(event.target.checked)}
      >
        {task?.name}
      </Checkbox>
      <Space>
        <Spin 
          spinning={changingStatus} 
          size='small' 
          indicator={<LoadingOutlined />} 
        />
        <Button 
          aria-label='Edit'
          icon={<EditOutlined />} 
          size='small' 
          className='hover-control' 
          disabled={changingStatus || deleting}
        />
        <Button 
          aria-label='Delete'
          icon={<DeleteOutlined />} 
          size='small' 
          danger 
          className='hover-control' 
          disabled={changingStatus}
          loading={deleting}
          onClick={handleDelete} 
        />
      </Space>
    </List.Item>
  );
}

TaskListItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    completed: PropTypes.bool
  }), 
  onStatusChange: PropTypes.func,
  onDeleteClick: PropTypes.func
};

export default TaskListItem;