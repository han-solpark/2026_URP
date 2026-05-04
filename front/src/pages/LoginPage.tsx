import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Loading from '../components/Loading';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await api.postNoAuth('/users/log-in', { user_id: userId, password });

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/');
      } else {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container centered-page">
      {isLoading && <Loading />}
      <div className="auth-box">
        <h1 className="auth-title">QUANTUM</h1>
        <h2 className="auth-subtitle">LOGIN</h2>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group inline-group">
            <label htmlFor="userId">아이디</label>
            <input
              type="text"
              id="userId"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div className="input-group inline-group">
            <label htmlFor="userPassword">비밀번호</label>
            <input
              type="password"
              id="userPassword"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: 'red', fontSize: '0.85rem' }}>{error}</p>}

          <button type="submit" className="login-btn">로그인</button>
        </form>

        <div className="auth-footer">
          <p>계정이 없으신가요?</p>
          <button className="signup-link-btn" onClick={() => navigate('/signup')}>
            없으면 회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
