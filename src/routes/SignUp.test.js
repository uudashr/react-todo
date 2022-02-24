import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import SignUp from './SignUp';

describe('SignUp', () => {
  const setup = () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );
  };

  it('renders email input', () => {
    setup();

    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
  });

  it('renders name input', () => {
    setup();

    const input = screen.getByLabelText('Name');
    expect(input).toBeInTheDocument();
  });

  it('renders password input', () => {
    setup();

    const input = screen.getByLabelText('Password');
    expect(input).toBeInTheDocument();
  });

  it('renders confirm password input', () => {
    setup();

    const input = screen.getByLabelText('Confirm password');
    expect(input).toBeInTheDocument();
  });

  it('renders sign me up button', () => {
    setup();

    const button = screen.getByRole('button', { name: 'Sign me up' });
    expect(button).toBeInTheDocument();
  });

  test('sign up with empty from', async () => {
    setup();

    const button = screen.getByRole('button', { name: 'Sign me up' });
    fireEvent.click(button);

    await waitFor(() => {
      const message = screen.getByText('Email is required!')
      expect(message).toBeInTheDocument();
    });

    await waitFor(() => {
      const message = screen.getByText('Name is required!')
      expect(message).toBeInTheDocument();
    });

    await waitFor(() => {
      const message = screen.getByText('Password is required!')
      expect(message).toBeInTheDocument();
    });

    await waitFor(() => {
      const message = screen.getByText('Confirm password is required!')
      expect(message).toBeInTheDocument();
    });
  });

  test('email input validity', async () => {
    setup();

    const input = screen.getByLabelText('Email');

    fireEvent.change(input, { target: { value: 'john.appleseed' }});
    await waitFor(() => {
      const message = screen.getByText('Email is not a valid email!')
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

  test('name input validity', async () => {
    setup();
    
    const input = screen.getByLabelText('Name');

    fireEvent.change(input, { target: { value: 'John' }});
    await waitFor(() => {
      const message = screen.queryByText('Name is required!');
      expect(message).not.toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: '' }});
    await waitFor(() => {
      const message = screen.getByText('Name is required!');
      expect(message).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'John' }});
    await waitFor(() => {
      const message = screen.queryByText('Name is required!');
      expect(message).not.toBeInTheDocument();
    });
  });

  test('password input validity', async () => {
    setup();
    
    const input = screen.getByLabelText('Password');

    fireEvent.change(input, { target: { value: 'secret' }});
    await waitFor(() => {
      const message = screen.queryByText('Password is required!');
      expect(message).not.toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: '' }});
    await waitFor(() => {
      const message = screen.getByText('Password is required!');
      expect(message).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'secret' }});
    await waitFor(() => {
      const message = screen.queryByText('Password is required!');
      expect(message).not.toBeInTheDocument();
    });
  });

  test('confirm password input validity', async () => {
    setup();
    
    const input = screen.getByLabelText('Password');
    const confirmInput = screen.getByLabelText('Confirm password');

    fireEvent.change(confirmInput, { target: { value: 'secret' }});
    await waitFor(() => {
      const message = screen.getByText('The passwords not match!');
      expect(message).toBeInTheDocument();
    });

    fireEvent.change(confirmInput, { target: { value: '' }});
    await waitFor(() => {
      const message = screen.getByText('Confirm password is required!');
      expect(message).toBeInTheDocument();
    });

    fireEvent.change(confirmInput, { target: { value: 'secret' }});
    await waitFor(() => {
      const message = screen.getByText('The passwords not match!');
      expect(message).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: 'secret' }});
    await waitFor(() => {
      const message = screen.queryByText('The passwords not match!');
      expect(message).not.toBeInTheDocument();
    });
  });

});