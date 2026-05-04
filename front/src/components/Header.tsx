import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 토큰 유무로 로그인 상태를 판단합니다.
  const isLoggedIn = !!localStorage.getItem('token');
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    // 로그아웃 로직: 토큰 삭제 후 로그인 페이지로 이동
    localStorage.removeItem('token');
    console.log('로그아웃');
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    <header className="header new-header-layout">
      <div className="header-spacer"></div>
      <nav className="header-left-nav">
        {isLoggedIn && !isHomePage && (
          <>
            <NavLink to="/past-activities" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>이전 활동</NavLink>
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>HOME</NavLink>
            <NavLink to="/recommend" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>활동 추천</NavLink>
            <NavLink to="/roadmap" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>로드맵</NavLink>
            <NavLink to="/activities" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>전체 활동</NavLink>
          </>
        )}
      </nav>
      
      <div className="header-right-actions">
        {isLoggedIn && !isHomePage ? (
          <>
            <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
            <button className="profile-icon-btn" onClick={() => navigate('/my-info')} title="내 정보 보기">
              {/* 프로필 아이콘 */}
              <div className="user-icon-placeholder">🙂</div>
            </button>
          </>
        ) : (
          <>
            <button className="login-btn-header" onClick={() => navigate('/login')}>로그인</button>
            <button className="signup-btn-header" onClick={() => navigate('/signup')}>회원가입</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;