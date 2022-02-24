import React from 'react';
import PropTypes from 'prop-types';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider, RequireAuth } from './auth'

import Todo from './routes/Todo';
import LogIn from './routes/LogIn';
import SignUp from './routes/SignUp';

function App(props) {
  const {todoClient} = props;

  return (
    <BrowserRouter>
      <AuthProvider authClient={todoClient}>
        <Routes>
          <Route exact path="/" element={<Navigate to='/todo' />} />
          <Route 
            path="/todo" 
            element={
              <RequireAuth>
                <Todo taskClient={todoClient} />
              </RequireAuth>
            } 
          />
          <Route path="/login" element={<LogIn authClient={todoClient} />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

App.propTypes = {
  todoClient: PropTypes.object,
};

export default App;