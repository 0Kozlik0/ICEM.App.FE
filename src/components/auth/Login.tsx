import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import vggLogo from '../../assets/images/VGG.png';

interface LoginProps {
  onLogin: (isAuthenticated: boolean) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'password123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('lastActivity', Date.now().toString());
      onLogin(true);
      navigate('/');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={vggLogo} alt="VGG Logo" className="login-logo" />
          <h1>Intelligent Assistant</h1>
          <p className="login-subtitle">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login; 