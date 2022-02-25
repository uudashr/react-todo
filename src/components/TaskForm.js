import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Button, Input } from "antd";


function TaskForm(props) {
  const { onAdd, nameValue } = props;
  
  const [name, setName] = React.useState(nameValue || '');
  const [addTaskEnabled, setAddTaskEnabled] = React.useState(!!nameValue);
  const [loading, setLoading] = React.useState(false);

  const inputRef = React.useRef(null);

  const handleClick = () => {
    if (!onAdd) {
      return;
    }

    setLoading(true);
    onAdd(name, (err) => {
      setLoading(false);
      inputRef.current.focus();
      setName('');
    });
  };

  const handleKeyEnter = (event) => {
    if (!name) {
      return;
    }

    if (!onAdd) {
      return;
    }

    setLoading(true);
    onAdd(name, (err) => {
      setLoading(false);
      inputRef.current.focus();
      setName('');
    });
  };

  const handleKeyPress = (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    handleKeyEnter(event);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  React.useEffect(() => {
    setAddTaskEnabled(name.length !== 0);
  }, [name]);

  return (
    <Row gutter={10}>
      <Col flex={1}>
        <Input
          placeholder='Enter task name'
          value={name}
          onChange={handleNameChange}
          onKeyPress={handleKeyPress}
          disabled={loading}
          ref={inputRef} />
      </Col>
      <Col>
        <Button
          data-testid='add-task'
          type='primary'
          onClick={handleClick}
          disabled={!addTaskEnabled}
          loading={loading}
        >
          Add task
        </Button>
      </Col>
    </Row>
  );
}

TaskForm.propTypes = {
  nameValue: PropTypes.string,
  onAdd: PropTypes.func
};

export default TaskForm;