import { BorderTopOutlined } from '@ant-design/icons';
import axios from 'axios';

class FetchTodoClient {
  constructor(opts) {
    const baseURL = opts?.baseURL || 'http://localhost:3500';
    const timeout = opts?.timeout || 1000;

    this.axiosInstance = axios.create({
      baseURL,
      timeout,
    });

    this.tokenStorage = opts?.tokenStorage || memTokenStorage();
  }

  logIn(email, password) {
    return fetch("http://localhost:3500/authenticate", {
      method: 'POST',
      body: JSON.stringify({ email, password, type: 'web' }),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then(res => {
      if (!res.ok) {
        if (res.status === 401) {
          return res.json().then(body => {
            const { code, message} = body.error;
            return Promise.reject(new ApiError(code, message));
          })
        }

        return Promise.reject(new ApiError(res.status, res.statusText));
      }

      return res.json();
    }).then(body => {
      const { token } = body;
      this.tokenStorage.set(token);
      return token;
    });
  }

  token() {
    return this.tokenStorage.get();
  }

  signUp(email, name, password) {
    return fetch('http://localhost:3500/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (!res.ok) {
        if (res.status === 409) {
          return res.json().then(body => {
            const { code, message} = body.error;
            return Promise.reject(new ApiError(code, message));
          })
        }

        return Promise.reject(new ApiError(res.status, res.statusText));
      }

      return undefined;
    });
  }

  userInfo() {
    // TODO: need to capture 401 to force logOut
    return fetch('http://localhost:3500/userinfo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.tokenStorage.get()}`,
      },
      credentials: 'include'
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(new ApiError(res.status, res.statusText));
      }

      return res.json();
    }).then(body => ({ name: body.name, email: body.email }));
  }

  logOut() {
    this.tokenStorage.clear();
  }

  addTask(name) {
    // TODO: need to capture 401 to force logOut
    return fetch('http://localhost:3500/tasks', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Authorization': `Bearer ${this.tokenStorage.get()}`,
      },
      credentials: 'include'
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(ApiError(res.status, res.statusText));
      }

      return undefined;
    });
  }

  allTasks() {
    // TODO: need to capture 401 to force logOut
    return fetch('http://localhost:3500/tasks', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.tokenStorage.get()}`,
      },
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(new ApiError(res.status, res.statusText));
      }

      return res.json().then(body => body);
    });
  }

  outstandingTasks() {
    // TODO: need to capture 401 to force logOut
    const url = new URL('http://localhost:3500/tasks');
    url.search = new URLSearchParams({ completed: false });

    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.tokenStorage.get()}`,
      },
      credentials: 'include'
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(new ApiError(res.status, res.statusText));
      }

      return res.json().then(body => body);
    })
  }

  completedTasks() {
    // TODO: need to capture 401 to force logOut
    const url = new URL('http://localhost:3500/tasks');
    url.search = new URLSearchParams({ completed: true });

    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.tokenStorage.get()}`,
      },
      credentials: 'include'
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(new ApiError(res.status, res.statusText));
      }

      return res.json().then(body => body);
    });
  }

  updateTaskStatus(id, completed) {
    // TODO: need to capture 401 to force logOut
    if (completed) {
      return fetch(`http://localhost:3500/tasks/${id}/completed`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.tokenStorage.get()}`,
        },
        credentials: 'include'
      }).then(res => {
        if (!res.ok) {
          return Promise.reject(new ApiError(res.status, res.statusText));
        }

        return undefined
      });
    }

    return fetch(`http://localhost:3500/tasks/${id}/completed`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.tokenStorage.get()}`,
      },
      credentials: 'include'
    }).then(res => {
      if (!res.ok) {
        return Promise.reject(new ApiError(res.status, res.statusText));
      }

      return undefined
    });
  }
}

export default FetchTodoClient;

export class ApiError extends Error {
  constructor(code, message, ...params) {
    super(message, ...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = 'ApiError';
    this.code = code;
  }
}

export function memTokenStorage() {
  let token = undefined;

  const get = () => {
    return token;
  }

  const set = (val) => {
    token = val;
  }

  const clear = () => {
    token = undefined;
  }

  return { get, set, clear };
}

export function localTokenStorage(key) {
  const get = () => {
    return localStorage.getItem(key);
  }

  const set = (token) => {
    localStorage.setItem(key, token);
  }

  const clear = () => {
    localStorage.removeItem(key);
  }

  return { get, set, clear };
}