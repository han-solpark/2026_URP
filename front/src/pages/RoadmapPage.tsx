import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api';
import './RoadmapPage.css';

interface LikedActivity {
  activity_id: number;
  category: string;
  title: string;
  source_url: string;
  reason_for_recommendation: string;
}

interface UserInfo {
  school_year: number;
}

const RoadmapPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<LikedActivity[]>([]);
  const [schoolYear, setSchoolYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/me/liked-activities'),
      api.get('/users/me'),
    ]).then(([likedData, userData]: [LikedActivity[], UserInfo]) => {
      setActivities(likedData);
      setSchoolYear(userData.school_year);
    }).finally(() => setLoading(false));
  }, []);

  const cancelHeart = async (activityId: number) => {
    await api.post('/users/me/liked-activities', { activity_id: activityId });
    setActivities(prev => prev.filter((a: LikedActivity) => a.activity_id !== activityId));
  };

  if (loading) return <div className="roadmap-page"><p>불러오는 중...</p></div>;

  return (
    <div className="roadmap-page">
      <div className="roadmap-header">
        <h2>나만의 커리어 로드맵</h2>
        {schoolYear && (
          <div className="current-grade-badge">현재 학년: {schoolYear}학년</div>
        )}
      </div>

      <div className="roadmap-content">
        {schoolYear && (
          <h3 className="roadmap-title">{schoolYear}학년 중점 활동 로드맵</h3>
        )}

        {activities.length > 0 ? (
          <div className="roadmap-list">
            {activities.map(activity => (
              <div key={activity.activity_id} className="roadmap-item">
                <div className="item-info">
                  <span className="roadmap-category">{activity.category}</span>
                  <h4>{activity.title}</h4>
                  <div className="roadmap-reason">
                    <strong>추천 이유:</strong> {activity.reason_for_recommendation}
                  </div>
                  <a href={activity.source_url} target="_blank" rel="noopener noreferrer" className="roadmap-link-btn">
                    활동 바로가기 ↗
                  </a>
                </div>
                <button
                  className="heart-cancel-btn"
                  onClick={() => cancelHeart(activity.activity_id)}
                  title="관심 활동 취소"
                >
                  ❤️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-roadmap">
            <p>아직 로드맵에 추가된 활동이 없습니다.</p>
            <p>활동 추천 페이지에서 마음에 드는 활동에 하트를 눌러보세요!</p>
            <button className="go-recommend-btn" onClick={() => navigate('/recommend')}>
              활동 추천받으러 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapPage;
