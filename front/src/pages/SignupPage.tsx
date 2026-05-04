import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Loading from '../components/Loading';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [schoolYear, setSchoolYear] = useState('');
  const [idMessage, setIdMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckDuplicate = async () => {
    if (!userId) {
      setIdMessage({ text: '아이디를 입력해주세요.', isError: true });
      return;
    }
    setIsLoading(true);
    try {
      const data = await api.get(`/users/check-username/${userId}`);
      setIdMessage({
        text: data.available ? '사용 가능한 아이디입니다' : '이미 사용 중인 아이디입니다',
        isError: !data.available,
      });
    } catch (err) {
      setIdMessage({ text: '확인 중 오류가 발생했습니다.', isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idMessage || idMessage.isError) {
      alert('아이디 중복 확인을 해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await api.postNoAuth('/users/sign-up', {
        user_id: userId,
        password,
        name,
        school_year: Number(schoolYear),
      });

      alert('회원가입이 완료되었습니다! 로그인해 주세요.');
      navigate('/login');
    } catch (err) {
      alert('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container centered-page">
      {isLoading && <Loading />}
      <div className="auth-box large-auth-box">
        <h1 className="auth-title">QUANTUM</h1>
        <h2 className="auth-subtitle">회원가입</h2>

        <form onSubmit={handleSignup} className="auth-form">
          <div className="input-group-container">
            <div className="input-group inline-group">
              <label htmlFor="newUserId">아이디</label>
              <div className="input-with-button">
                <input
                  type="text"
                  id="newUserId"
                  placeholder="사용할 아이디"
                  value={userId}
                  onChange={(e) => { setUserId(e.target.value); setIdMessage(null); }}
                  required
                />
                <button type="button" className="check-duplicate-btn" onClick={handleCheckDuplicate}>
                  중복 확인
                </button>
              </div>
            </div>
            {idMessage && (
              <div className={`id-message ${idMessage.isError ? 'error-msg' : 'success-msg'}`}>
                {idMessage.text}
              </div>
            )}
          </div>

          <div className="input-group inline-group">
            <label htmlFor="newUserPassword">비밀번호</label>
            <input
              type="password"
              id="newUserPassword"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group inline-group">
            <label htmlFor="userName">이름</label>
            <input
              type="text"
              id="userName"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group inline-group">
            <label htmlFor="userGrade">학년</label>
            <select
              id="userGrade"
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              required
            >
              <option value="">선택</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              <option value="4">4학년</option>
            </select>
          </div>

          <button type="submit" className="signup-btn">회원가입 완료</button>
        </form>

        <div className="auth-footer">
          <button className="back-btn" onClick={() => navigate('/login')}>
            취소 및 로그인 화면으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
