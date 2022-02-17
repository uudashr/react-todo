import React from 'react';
import PropTypes from 'prop-types';

import { Checkbox, List, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';

function TaskListItem(props) {
  const {task, onStatusChange} = props;

  const [loading, setLoading] = React.useState(false);

  const handleStatusChange = (task) => {
    if (!onStatusChange) {
      return;
    }

    setLoading(true);
    onStatusChange(task, (err) => {
      setLoading(false);
    });
  };

  return (
    <List.Item>
      <Checkbox
        style={{ width: '100%' }}
        disabled={loading}
        checked={task?.completed || false}
        onChange={(event) => {
          handleStatusChange({
            id: task?.id,
            completed: event.target.checked
          });
        }}
      >
        {task?.name}
      </Checkbox>
      <Spin spinning={loading} style={{ fontSize: 9 }} indicator={<LoadingOutlined />} />
    </List.Item>
  );
}

TaskListItem.propTypes = {
  task: PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    completed: PropTypes.bool
  }), 
  onStatusChange: PropTypes.func
};

export default TaskListItem;