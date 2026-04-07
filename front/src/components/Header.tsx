// react-router-dom의 NavLink를 사용하면 현재 경로에 맞는 스타일을 쉽게 적용할 수 있습니다.
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  // 실제 서비스라면 이곳에서 로그인 상태를 관리합니다.
  const isLoggedIn = true; // 예시 상태

  const handleLogout = () => {
    // 로그아웃 로직 (서버 요청, 로컬 스토리지 삭제 등)
    console.log('로그아웃');
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    <header className="header new-header-layout">
      <div className="header-spacer"></div>
      <nav className="header-left-nav">
        {/* NavLink의 isActive 속성을 사용하여 'Active' 클래스를 적용합니다. */}
        <NavLink to="/past-activities" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>이전 활동</NavLink>
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>HOME</NavLink>
        <NavLink to="/recommend" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>활동 추천</NavLink>
        <NavLink to="/roadmap" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>로드맵</NavLink>
      </nav>
      
      <div className="header-right-actions">
        {isLoggedIn ? (
          <>
            <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
            <button className="profile-icon-btn" onClick={() => navigate('/my-info')} title="내 정보 보기">
              {/* 프로필 아이콘 (간단한 원형이나 사용자 아이콘 사용) */}
              <div className="user-icon-placeholder">🙂</div>
            </button>
          </>
        ) : (
          <div className="header-spacer"></div>
        )}
      </div>
    </header>
  );
};

export default Header;