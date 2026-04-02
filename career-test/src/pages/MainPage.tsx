import './MainPage.css';
import logoImg from './logo.png'; 

const MainPage = () => {
  return (
    <div className="main-container main-page-with-description">
      <div className="main-logo-section">
        <img 
          src={logoImg} 
          alt="Quantum Logo" 
          className="home-main-logo" 
        />
      </div>
      
      <div className="main-description-section">
        <p className="description-subtitle">더 큰 도약을 위한 당신만의 네비게이션</p>
        <p className="description-paragraph">
          지나온 경험을 기록하고, 데이터 기반의 맞춤 활동을 제안합니다.
        </p>
      </div>
    </div>
  );
};

export default MainPage;