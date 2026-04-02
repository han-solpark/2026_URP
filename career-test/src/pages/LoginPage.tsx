import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 서비스에서는 이곳에서 서버에 로그인 요청을 보냅니다.
    // 여기서는 예시로 성공 시 홈으로 이동하도록 합니다.
    console.log('로그인 시도');
    navigate('/');
  };

  return (
    <div className="auth-container centered-page">
      <div className="auth-box">
        <h1 className="auth-title">QUANTUM</h1>
        <h2 className="auth-subtitle">LOGIN</h2>
        
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label htmlFor="userId">아이디</label>
            <input type="text" id="userId" placeholder="아이디를 입력하세요" />
          </div>
          <div className="input-group">
            <label htmlFor="userPassword">비번</label>
            <input type="password" id="userPassword" placeholder="비밀번호를 입력하세요" />
          </div>
          
          <button type="submit" className="login-btn">로그인</button>
        </form>
        
        <div className="auth-footer">
          <p>계정이 없으신가요?</p>
          <button 
            className="signup-link-btn" 
            onClick={() => navigate('/signup')}
          >
            없으면 회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;