import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api';
import Loading from '../components/Loading';
import './RecommendPage.css';

interface Recommendation {
  activity_id: number;
  category: string;
  title: string;
  source_url: string;
  reason_for_recommendation: string;
  fitness_score: number;
  liked: boolean;
}

const RecommendPage = () => {
  const navigate = useNavigate();
  const [isRecommended, setIsRecommended] = useState(false);
  const [preferredSentence, setPreferredSentence] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [prefWeight, setPrefWeight] = useState(50);
  const [activityWeight, setActivityWeight] = useState(50);
  const [typeWeight, setTypeWeight] = useState(50);

  const keywords = [
    '인공지능(AI)', '데이터 분석', '반도체', '코딩', '자율주행',
    '기초과학연구', '바이오/제약', '신소재/에너지', '건축', '인턴/현장실습',
    '공모전', '경진대회', '학술연구', '창업준비', '진로탐색'
  ];

  useEffect(() => {
    api.get('/recommendations/get').then((data: Recommendation[]) => {
      if (data && data.length > 0) {
        setRecommendations(data);
        setLikedIds(data.filter(r => r.liked).map(r => r.activity_id));
        setIsRecommended(true);
      }
    }).finally(() => setInitialLoading(false));
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isRecommended) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isRecommended]);

  const toggleHeart = async (activityId: number) => {
    await api.post('/users/me/liked-activities', { activity_id: activityId });
    setLikedIds(prev =>
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleBack = () => {
    if (window.confirm('이전 화면으로 돌아가시겠습니까? 추천된 활동 정보는 사라지며 다시 입력해야 합니다.')) {
      setIsRecommended(false);
      setRecommendations([]);
    }
  };

  const handleRecommend = async () => {
    if (preferredSentence.trim().length < 5) {
      alert('관심 있는 활동이나 목표를 최소 5자 이상 적어주세요.');
      return;
    }
    setIsLoading(true);
    await api.post('/users/me/preference', { preference: preferredSentence });
    const data = await api.post('/recommendations/recommend', {
      pref_weight: prefWeight,
      activities_weight: activityWeight,
      type_weight: typeWeight,
    });
    setRecommendations(data);
    setLikedIds(data.filter((r: Recommendation) => r.liked).map((r: Recommendation) => r.activity_id));
    setIsLoading(false);
    setIsRecommended(true);
  };

  if (initialLoading) return <Loading />;

  if (!isRecommended) {
    return (
      <div className="recommend-page">
        {isLoading && <Loading />}
        <div className="recommend-header">
          <h2>맞춤 활동 추천</h2>
          <p className="recommend-subtitle">당신이 관심 있는 활동이나 목표를 한 문장으로 적어주세요.</p>
        </div>

        <div className="input-section">
          <div className="keyword-container">
            {keywords.map((keyword, index) => (
              <div key={index} className="keyword-bubble">{keyword}</div>
            ))}
          </div>

          <div className="sentence-input-wrapper">
            <div className="textarea-container">
              <textarea
                className="sentence-input"
                placeholder="예: 인공지능 분야의 연구 역량을 키워서 관련 기업에 취업하고 싶어요."
                value={preferredSentence}
                onChange={(e) => setPreferredSentence(e.target.value)}
                maxLength={200}
              />
              <div className="char-count">{preferredSentence.length}/200</div>
            </div>
            <button className="get-recommend-btn" onClick={handleRecommend} disabled={isLoading}>
              {isLoading ? '추천 중...' : '활동 추천 받기'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recommend-page">
      {isLoading && <Loading />}
      <div className="recommend-header">
        <button className="back-btn" onClick={handleBack}>← 다시 입력하기</button>
        <h2>맞춤 활동 추천 결과</h2>

        <div className="weight-control-container">
          <h3 className="weight-control-title">반영 비율 조정</h3>
          <div className="weight-sliders">
            <div className="weight-slider-item">
              <label>선호 문장</label>
              <input type="range" min="1" max="100" value={prefWeight}
                onChange={(e) => setPrefWeight(Number(e.target.value))} />
              <span className="weight-value">{prefWeight}</span>
            </div>
            <div className="weight-slider-item">
              <label>과거 활동</label>
              <input type="range" min="1" max="100" value={activityWeight}
                onChange={(e) => setActivityWeight(Number(e.target.value))} />
              <span className="weight-value">{activityWeight}</span>
            </div>
            <div className="weight-slider-item">
              <label>유형 결과</label>
              <input type="range" min="1" max="100" value={typeWeight}
                onChange={(e) => setTypeWeight(Number(e.target.value))} />
              <span className="weight-value">{typeWeight}</span>
            </div>
          </div>
        </div>

        <div className="test-summary">
          <p>입력하신 문장: <strong>"{preferredSentence}"</strong></p>
        </div>
      </div>

      <div className="recommend-grid">
        {recommendations.map(item => (
          <div key={item.activity_id} className="recommend-card">
            <span className="recommend-category">{item.category}</span>
            <h3 className="recommend-title">{item.title}</h3>

            <div className="recommend-reason-box">
              <span className="reason-label">✨ 추천 이유</span>
              <p className="reason-text">{item.reason_for_recommendation}</p>
            </div>

            <div className="card-actions">
              <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="link-btn">
                상세보기
              </a>
              <button
                className={`heart-btn ${likedIds.includes(item.activity_id) ? 'active' : ''}`}
                onClick={() => toggleHeart(item.activity_id)}
              >
                {likedIds.includes(item.activity_id) ? '❤️' : '🤍'}
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
