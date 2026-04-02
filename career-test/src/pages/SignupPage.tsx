import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 서비스에서는 이곳에서 서버에 회원가입 요청을 보냅니다.
    console.log('회원가입 완료 시도');
    alert('회원가입이 완료되었습니다! 로그인해 주세요.');
    navigate('/login');
  };

  return (
    <div className="auth-container centered-page">
      <div className="auth-box large-auth-box">
        <h1 className="auth-title">QUANTUM</h1>
        <h2 className="auth-subtitle">회원가입</h2>
        
        <form onSubmit={handleSignup} className="auth-form">
          <div className="input-group">
            <label htmlFor="newUserId">아이디</label>
            <input type="text" id="newUserId" placeholder="사용할 아이디를 입력하세요" required />
          </div>
          <div className="input-group">
            <label htmlFor="newUserPassword">비번</label>
            <input type="password" id="newUserPassword" placeholder="비밀번호를 입력하세요" required />
          </div>
          <div className="input-group">
            <label htmlFor="userName">이름</label>
            <input type="text" id="userName" placeholder="이름을 입력하세요" required />
          </div>
          <div className="input-group">
            <label htmlFor="userSchool">학교</label>
            <input type="text" id="userSchool" placeholder="학교명을 입력하세요" required />
          </div>
          <div className="input-group">
            <label htmlFor="userGrade">학년</label>
            <select id="userGrade" required>
              <option value="">학년 선택</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="4">4학년</option>
            </select>
          </div>
          
          <button type="submit" className="signup-btn">회원가입 완료</button>
        </form>
        
        <div className="auth-footer">
          <button 
            className="back-btn" 
            onClick={() => navigate('/login')}
          >
            취소 및 로그인 화면으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;