import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import './RoadmapPage.css';

interface Recommendation {
  id: number;
  category: string;
  title: string;
  description: string;
  recommendationReason: string;
  url: string;
}

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { 
    id: 1, 
    category: '연구활동', 
    title: '교내 URP 프로그램', 
    description: '교수님과 함께하는 학부생 연구 기회입니다. 실무 연구 역량을 쌓을 수 있습니다.',
    recommendationReason: '관심 분야인 AI 연구에 대한 실무 경험을 쌓기에 가장 적합한 활동입니다.',
    url: 'https://www.example.com/urp'
  },
  { 
    id: 2, 
    category: '자기계발', 
    title: '데이터 분석 캠프', 
    description: 'Python과 SQL을 활용한 실무 데이터 분석 역량을 강화하는 집중 교육 과정입니다.',
    recommendationReason: '데이터 분석가로의 커리어 전환을 위한 필수 역량을 단기간에 집중적으로 습득할 수 있습니다.',
    url: 'https://www.example.com/data-camp'
  },
  { 
    id: 3, 
    category: '공모전', 
    title: 'IT 서비스 아이디어 공모전', 
    description: '사회 문제를 해결하는 혁신적인 IT 서비스 모델을 제안하고 시상받을 수 있는 기회입니다.',
    recommendationReason: '기획력을 입증할 수 있는 결과물을 만들 수 있으며, 수상 시 강력한 포트폴리오가 됩니다.',
    url: 'https://www.example.com/it-contest'
  },
  { 
    id: 4, 
    category: '인턴십', 
    title: '동계 스타트업 인턴십', 
    description: '유망 스타트업에서 실제 프로젝트를 수행하며 실무 감각을 익힐 수 있는 프로그램입니다.',
    recommendationReason: '실제 서비스 개발 환경을 경험함으로써 협업 능력과 문제 해결 능력을 동시에 키울 수 있습니다.',
    url: 'https://www.example.com/internship'
  },
  { 
    id: 5, 
    category: '스터디', 
    title: '알고리즘 코테 준비반', 
    description: '주요 IT 기업의 코딩 테스트 대비를 위한 체계적인 문제 풀이 및 코드 리뷰 스터디입니다.',
    recommendationReason: '원하시는 대기업 취업을 위해 가장 먼저 넘어야 할 코딩 테스트 관문을 체계적으로 준비할 수 있습니다.',
    url: 'https://www.example.com/algo-study'
  }
];

const RoadmapPage = () => {
  const navigate = useNavigate();
  const [heartedIds, setHeartedIds] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('heartedActivities');
    if (saved) {
      setHeartedIds(JSON.parse(saved));
    }
  }, []);

  const toggleHeart = (id: number) => {
    const newHearted = heartedIds.filter(hId => hId !== id);
    setHeartedIds(newHearted);
    localStorage.setItem('heartedActivities', JSON.stringify(newHearted));
  };

  const heartedActivities = useMemo(() => {
    return MOCK_RECOMMENDATIONS.filter(item => heartedIds.includes(item.id));
  }, [heartedIds]);

  return (
    <div className="roadmap-page">
      <div className="roadmap-header">
        <h2>나만의 커리어 로드맵</h2>
        <div className="current-grade-badge">현재 학년: 3학년</div>
      </div>

      <div className="roadmap-content">
        <h3 className="roadmap-title">3학년 중점 활동 로드맵</h3>
        
        {heartedActivities.length > 0 ? (
          <div className="roadmap-list">
            {heartedActivities.map(activity => (
              <div key={activity.id} className="roadmap-item">
                <div className="item-info">
                  <span className="roadmap-category">{activity.category}</span>
                  <h4>{activity.title}</h4>
                  <p className="activity-desc">{activity.description}</p>
                  <div className="roadmap-reason">
                    <strong>추천 이유:</strong> {activity.recommendationReason}
                  </div>
                  <a href={activity.url} target="_blank" rel="noopener noreferrer" className="roadmap-link-btn">
                    활동 바로가기 ↗
                  </a>
                </div>
                <button 
                  className="heart-cancel-btn"
                  onClick={() => toggleHeart(activity.id)}
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
