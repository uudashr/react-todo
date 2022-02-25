import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, Input, List, Spin, Space, Button, message } from "antd";
import { LoadingOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import './TaskListItem.css';

function TaskEditForm(props) {
  const { 
    value = '', 
    onSave = (value, callback) => { callback() }, 
    onCancel = () => {}
  } = props;

  const [taskName, setTaskName] = React.useState(value);
  const [saving, setSaving] = React.useState(false);

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };

  const handleSave = () => {
    if (!taskName) {
      return;
    }

    setSaving(true);
    onSave(taskName, (err) => {
      if (err) {
        setSaving(false);
      }
    });
  };

  const handleKeyEnter = (event) => {
    if (!taskName) {
      return;
    }

    setSaving(true);
    onSave(taskName, (err) => {
      if (err) {
        setSaving(false);
      }
    });
  };

  const handleKeyPress = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    handleKeyEnter(event);
  };

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
        <Input 
          value={taskName} 
          onChange={handleTaskNameChange} 
          onKeyPress={handleKeyPress}
        />
        <Space>
          <Button
            type='primary'
            size='small'
            onClick={handleSave}
            loading={saving}
          >
            Save
          </Button>

          <Button 
            size='small' 
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Space>
      </Space>
  );
}

TaskEditForm.propTypes = {
  value: PropTypes.string,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};

function TaskView(props) {
  const { 
    name = '', 
    completed = false, 
    deleting = false, // TODO: state 'deleting' or 'changingStatus' should be execlusive
    changingStatus = false, 
    onStatusChange = (completed) => {}, 
    onDelete = () => {},
    onEdit = () => {}
  } = props;

  return (
    <>
      <Checkbox
        style={{ width: '100%' }}
        disabled={changingStatus || deleting}
        checked={completed}
        onChange={event => onStatusChange(event.target.checked)}
      >
        {name}
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
          onClick={onEdit}
        />
        <Button 
          aria-label='Delete'
          icon={<DeleteOutlined />} 
          size='small' 
          danger 
          className='hover-control' 
          disabled={changingStatus}
          loading={deleting}
          onClick={onDelete} 
        />
      </Space>
    </>
  );
}

TaskView.propTypes = {
  name: PropTypes.string,
  completed: PropTypes.bool,
  deleting: PropTypes.bool,
  changingStatus: PropTypes.bool,
  onStatusChange: PropTypes.func,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

function TaskListItem(props) {
  const { 
    task, 
    onStatusChange = (task, callback) => callback(), 
    onNameChange = (task, callback) => callback(), 
    onDelete = (id, callback) => callback(),
  } = props;

  const [changingStatus, setChangingStatus] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

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

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  const handleNameChange = (name) => {
    onNameChange({id: task.id, name}, (err) => {
      if (err) {
        return;
      }

      setEditMode(false);
    });
  };

  const handleDelete = () => {
    if (!task) {
      return;
    }

    setDeleting(true);
    onDelete(task.id, (err) => {
      if (err) {
        setDeleting(false);
      }
    });
  };

  return (
    <List.Item className='hoverable'>
      {editMode ?
        <TaskEditForm 
          style={{ display: 'none' }}
          value={task?.name}
          onSave={handleNameChange}
          onCancel={handleCancelEdit}
        />  
        :
        <TaskView 
          name={task?.name} 
          completed={task?.completed} 
          changingStatus={changingStatus}
          deleting={deleting}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      }
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
  onNameChange: PropTypes.func,
  onDelete: PropTypes.func
};

export default TaskListItem;