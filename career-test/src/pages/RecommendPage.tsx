import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './RecommendPage.css';

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

const RecommendPage = () => {
  const navigate = useNavigate();
  const [isRecommended, setIsRecommended] = useState(false);
  const [preferredSentence, setPreferredSentence] = useState('');
  const [heartedIds, setHeartedIds] = useState<number[]>([]);

  const keywords = ['데이터 분석', 'AI 연구', '웹 개발', '기획', '디자인', '마케팅', '문제 해결', '프로젝트 매니징'];

  useEffect(() => {
    const saved = localStorage.getItem('heartedActivities');
    if (saved) {
      setHeartedIds(JSON.parse(saved));
    }
  }, []);

  const toggleHeart = (id: number) => {
    const newHearted = heartedIds.includes(id)
      ? heartedIds.filter(hId => hId !== id)
      : [...heartedIds, id];
    
    setHeartedIds(newHearted);
    localStorage.setItem('heartedActivities', JSON.stringify(newHearted));
  };

  const handleBack = () => {
    if (window.confirm('이전 화면으로 돌아가시겠습니까? 추천된 활동 정보는 사라지며 다시 입력해야 합니다.')) {
      setIsRecommended(false);
    }
  };

  const handleRecommend = () => {
    if (preferredSentence.trim().length < 5) {
      alert('관심 있는 활동이나 목표를 최소 5자 이상 적어주세요.');
      return;
    }
    // 실제 서비스라면 여기서 입력을 서버로 보내서 AI 추천을 받겠지만,
    // 현재는 목업 데이터(MOCK_RECOMMENDATIONS)를 보여줍니다.
    setIsRecommended(true);
  };

  if (!isRecommended) {
    return (
      <div className="recommend-page">
        <div className="recommend-header">
          <h2>맞춤 활동 추천</h2>
          <p className="recommend-subtitle">당신이 관심 있는 활동이나 목표를 한 문장으로 적어주세요.</p>
        </div>

        <div className="input-section">
          <div className="keyword-container">
            {keywords.map((keyword, index) => (
              <div key={index} className="keyword-bubble">
                {keyword}
              </div>
            ))}
          </div>
          
          <div className="sentence-input-wrapper">
            <textarea 
              className="sentence-input" 
              placeholder="예: 데이터 분석 역량을 키워서 IT 서비스 기획자가 되고 싶어요."
              value={preferredSentence}
              onChange={(e) => setPreferredSentence(e.target.value)}
              maxLength={200}
            />
            <button className="get-recommend-btn" onClick={handleRecommend}>
              활동 추천 받기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recommend-page">
      <div className="recommend-header">
        <button className="back-btn" onClick={handleBack}>← 다시 입력하기</button>
        <h2>맞춤 활동 추천 결과</h2>
        <div className="warning-banner">
          ⚠️ 현재 페이지를 나가면 추천 결과를 다시 확인할 수 없으니, 관심 있는 활동은 미리 하트(❤️)를 눌러 저장해 주세요!
        </div>
        <div className="test-summary">
          <p>입력하신 문장: <strong>"{preferredSentence}"</strong></p>
          <p>분석된 키워드: 데이터 분석, 서비스 기획, 문제 해결</p>
        </div>
      </div>

      <div className="recommend-grid">
        {MOCK_RECOMMENDATIONS.map(item => (
          <div key={item.id} className="recommend-card">
            <span className="recommend-category">{item.category}</span>
            <h3 className="recommend-title">{item.title}</h3>
            <p className="recommend-desc">{item.description}</p>
            
            <div className="recommend-reason-box">
              <span className="reason-label">✨ 추천 이유</span>
              <p className="reason-text">{item.recommendationReason}</p>
            </div>

            <div className="card-actions">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-btn">상세보기</a>
              <button 
                className={`heart-btn ${heartedIds.includes(item.id) ? 'active' : ''}`}
                onClick={() => toggleHeart(item.id)}
              >
                {heartedIds.includes(item.id) ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="roadmap-nav-btn" onClick={() => navigate('/roadmap')}>
        나만의 로드맵 확인하기
      </button>
    </div>
  );
};

export default RecommendPage;
