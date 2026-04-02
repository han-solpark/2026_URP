import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage'; // 로그인 페이지 추가
import SignupPage from './pages/SignupPage'; // 회원가입 페이지 추가
import CareerTest from './pages/career-test';
import MyInfoPage from './pages/MyInfoPage';
import RecommendPage from './pages/RecommendPage';
import RoadmapPage from './pages/RoadmapPage';
import PastActivitiesPage from './pages/PastActivitiesPage';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/test" element={<CareerTest />} />
          <Route path="/my-info" element={<MyInfoPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/past-activities" element={<PastActivitiesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;