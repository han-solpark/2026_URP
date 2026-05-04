import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage'; 
import SignupPage from './pages/SignupPage'; 
import CareerTest from './pages/career-test';
import MyInfoPage from './pages/MyInfoPage';
import RecommendPage from './pages/RecommendPage';
import RoadmapPage from './pages/RoadmapPage';
import PastActivitiesPage from './pages/PastActivitiesPage';
import ActivitiesPage from './pages/ActivitiesPage';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/signup'];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <>
      {!shouldHideHeader && <Header />}
      <div className={shouldHideHeader ? "" : "container"}>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/activities" /> : <LoginPage />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/activities" /> : <SignupPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/test" element={<CareerTest />} />
          <Route path="/my-info" element={<MyInfoPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/past-activities" element={<PastActivitiesPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;