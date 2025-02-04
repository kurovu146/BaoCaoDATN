import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { useAuth } from '../components/AuthContext';
import { CallAPI } from '../utils/common';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const dataInput = { email, password }
      const response = await CallAPI('POST', '/auth/login', dataInput);
      
      if (response.status === 201) {
        const data = await response.data;
        localStorage.setItem('user', JSON.stringify(data));
        login(data);
        navigate('/');
      } else {
        setError(response.statusText || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>} {/* Hiển thị lỗi */}
        <label>Email *</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password *</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-button primary">Log in</button>

        <a href="#" className="auth-link">Reset password</a>
      </form>
    </div>
  );
};

export default LoginPage;
