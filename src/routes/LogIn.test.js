import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { BrowserRouter, useNavigate } from "react-router-dom";
import { message } from 'antd';
import LogIn from './LogIn';
import { AuthProvider } from '../auth'

jest.mock('antd', () => {
  const originalModule = jest.requireActual('antd');

  return {
    ...originalModule,
    message: {
      ...originalModule.message,
      success: jest.fn(),
    }
  };
});

jest.mock('react-router-dom', () => {
  const navigate = jest.fn();
  const originalModule = jest.requireActual('react-router-dom')

  return {
    ...originalModule,
    useNavigate: () => navigate,
  };
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('Login', () => {
  const setup = () => {
    const authClient = {
      logIn: jest.fn(),
      logOut: jest.fn(),
      token: jest.fn()
    };

    render(
      <BrowserRouter>
        <AuthProvider authClient={authClient}>
          <LogIn />
        </AuthProvider>
      </BrowserRouter>
    );
    return { authClient };
  };

  it('renders email input', () => {
    setup();

    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
  });

  it('renders password input', () => {
    setup();

    const input = screen.getByLabelText('Password');
    expect(input).toBeInTheDocument();
  });

  it('renders log in button', () => {
    setup();

    const button = screen.getByRole('button', { name: 'Log in'});
    expect(button).toBeInTheDocument();
  });

  test('login with empty form', async () => {
    setup();

    const button = screen.getByRole('button', { name: 'Log in'});
    fireEvent.click(button);

    await waitFor(() => {
      const message = screen.getByText('Email is required!');
      expect(message).toBeInTheDocument();
    });

    await waitFor(() => {
      const message = screen.getByText('Password is required!');
      expect(message).toBeInTheDocument();
    });
  });

  test('email input validation', async () => {
    setup();

    const input = screen.getByLabelText('Email');

    fireEvent.change(input, { target: { value: 'john.appleseed' }});
    await waitFor(() => {
      const message = screen.getByText('Email is not a valid email!');
      expect(message).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'john.appleseed@mail.com' }});
    await waitFor(() => {
      const message = screen.queryByText('Email is not a valid email!')
      expect(message).not.toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: '' }});
    await waitFor(() => {
      const message = screen.getByText('Email is required!')
      expect(message).toBeInTheDocument();
    });
  });

  test('password input validation', async () => {
    setup();

    const input = screen.getByLabelText('Password');

    fireEvent.change(input, { target: { value: 'secret' }});
    fireEvent.change(input, { target: { value: '' }});
    await waitFor(() => {
      const message = screen.getByText('Password is required!')
      expect(message).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'secret' }});
    await waitFor(() => {
      const message = screen.queryByText('Password is required!')
      expect(message).not.toBeInTheDocument();
    });
  });

  test('login success', async () => {
    const { authClient } = setup();

    const email = 'john.appleseed@mail.com';
    const password = 'secret';

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const logInButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });

    authClient.logIn.mockResolvedValue('the-token');

    fireEvent.click(logInButton);
    await waitFor(() => {
      expect(authClient.logIn).toBeCalledWith(email, password);
    });

    const navigate = useNavigate();
    expect(message.success).toBeCalledWith('Logged in');
    expect(navigate).toBeCalledWith('/todo', { replace: true });
  });

  test('login failed', async () => {
    const { authClient } = setup();

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const logInButton = screen.getByRole('button', { name: 'Log in' });

    fireEvent.change(emailInput, { target: { value: "john.appleseed@mail.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });

    authClient.logIn.mockRejectedValue(new Error('Oops'));

    fireEvent.click(logInButton);
    await waitFor(() => {
      expect(authClient.logIn).toBeCalledWith("john.appleseed@mail.com", "secret");
    });

    const errorMessage = screen.getByText('Oops');
    expect(errorMessage).toBeInTheDocument();
  });
});