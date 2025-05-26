// AuthPage.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from './AuthPage.module.css';

export type Identity = 'teacher' | 'user' | 'superuser';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const url =
      mode === 'signup'
        ? '/api/user/createUser'
        : '/api/user/loginUser';

    const payload: Record<string, any> = {};
    if (mode === 'signup') {
      payload.username = form.get('username');
      payload.email = form.get('email');
      payload.password = form.get('password');
      payload.identity = form.get('identity');
    } else {
      payload.email = form.get('email');
      payload.password = form.get('password');
    }

    try {
      const res = await axios.post(url, payload);
      if (mode === 'signup') {
        setMode('signin');
      } else {
        window.location.href = res.data.redirectTo || '/dashboard';
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || '请求失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`${styles.container} ${
        mode === 'signup' ? styles.rightPanelActive : ''
      }`}
    >
      {/* 注册 */}
      <div className={styles.formContainer + ' ' + styles.signUpContainer}>
        <form onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          {error && <p className={styles.error}>{error}</p>}
          <input
            name="username"
            type="text"
            placeholder="Name"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <select name="identity" required>
            <option value="user">User</option>
            <option value="teacher">Teacher</option>
            <option value="superuser">Superuser</option>
          </select>
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : 'Sign Up'}
          </button>
        </form>
      </div>

      {/* 登录 */}
      <div className={styles.formContainer + ' ' + styles.signInContainer}>
        <form onSubmit={handleSubmit}>
          <h1>Sign In</h1>
          {error && <p className={styles.error}>{error}</p>}
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <a href="#">Forgot your password?</a>
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
        </form>
      </div>

      {/* Overlay */}
      <div className={styles.overlayContainer}>
        <div className={styles.overlay}>
          <div className={styles.overlayPanel + ' ' + styles.overlayLeft}>
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button
              className="ghost"
              onClick={() => setMode('signin')}
            >
              Sign In
            </button>
          </div>
          <div className={styles.overlayPanel + ' ' + styles.overlayRight}>
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button
              className="ghost"
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
