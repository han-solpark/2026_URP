import { useState, useMemo, useEffect } from 'react';
import { api } from '../api';
import './PastActivitiesPage.css';

interface Activity {
  id: number;
  title: string;
  category: string;
}

const MOCK_DB_ACTIVITIES: Activity[] = [
  { id: 1, title: '데이터 분석 기초 캠프', category: '비교과 활동' },
  { id: 2, title: '웹 프론트엔드 해커톤', category: '비교과 활동' },
  { id: 3, title: '정보처리기사 실기 스터디', category: '자격증' },
  { id: 4, title: '인공지능 연구실 학부생 인턴', category: '학부 연구실' },
  { id: 5, title: 'SQLD 자격증 취득 과정', category: '자격증' },
  { id: 6, title: '컴퓨터 비전 연구실 프로젝트', category: '학부 연구실' },
  { id: 7, title: '알고리즘 문제해결 동아리', category: '비교과 활동' },
  { id: 8, title: 'TOEIC Speaking 챌린지', category: '자격증' },
  { id: 9, title: '클라우드 컴퓨팅 연구실 세미나', category: '학부 연구실' },
  { id: 10, title: '봉사활동 기획단 2기', category: '비교과 활동' },
];

const PastActivitiesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [randomizedActivities, setRandomizedActivities] = useState<Activity[]>([]);

  const categories = ['전체', '비교과 활동', '자격증', '학부 연구실'];

  const [gradeActivities, setGradeActivities] = useState<Record<number, Activity[]>>({
    1: [], 2: [], 3: [], 4: [],
  });

  useEffect(() => {
    const shuffled = [...MOCK_DB_ACTIVITIES].sort(() => Math.random() - 0.5);
    setRandomizedActivities(shuffled);

    api.get('/users/me/past-activities').then(data => {
      if (!data) return;
      const toActivities = (ids: number[] | null) =>
        (ids ?? []).map(id => MOCK_DB_ACTIVITIES.find(a => a.id === id)).filter(Boolean) as Activity[];

      setGradeActivities({
        1: toActivities(data.grade1),
        2: toActivities(data.grade2),
        3: toActivities(data.grade3),
        4: toActivities(data.grade4),
      });
    });
  }, []);

  const filteredActivities = useMemo(() => {
    let result = randomizedActivities;
    if (selectedCategory !== '전체') {
      result = result.filter(a => a.category === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [searchQuery, randomizedActivities, selectedCategory]);

  const addActivityToGrade = (activity: Activity) => {
    setGradeActivities(prev => {
      const current = prev[selectedGrade] || [];
      if (current.find(a => a.id === activity.id)) {
        alert('이미 추가된 활동입니다.');
        return prev;
      }
      return { ...prev, [selectedGrade]: [...current, activity] };
    });
  };

  const removeActivityFromGrade = async (activityId: number) => {
    await api.delete(`/users/me/past-activities/${activityId}`);
    setGradeActivities(prev => ({
      ...prev,
      [selectedGrade]: prev[selectedGrade].filter(a => a.id !== activityId),
    }));
  };

  const handleSave = async () => {
    await api.post('/users/me/past-activities', {
      grade1: gradeActivities[1].map(a => a.id),
      grade2: gradeActivities[2].map(a => a.id),
      grade3: gradeActivities[3].map(a => a.id),
      grade4: gradeActivities[4].map(a => a.id),
    });
    alert('활동 기록이 저장되었습니다.');
  };

  return (
    <div className="past-activities-page-v2">
      <div className="activities-layout">
        {/* 왼쪽 섹션: 검색 및 활동 리스트 */}
        <div className="left-section">
          <div className="section-header">
            <div className="header-top-group">
              <div className="category-filters">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="search-bar-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="활동을 검색해보세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          <div className="activity-scroll-area">
            <div className="activity-grid-v2">
              {filteredActivities.length > 0 ? (
                filteredActivities.map(activity => (
                  <div key={activity.id} className="activity-card-v2">
                    <div className="card-content">
                      <span className="category-label">{activity.category}</span>
                      <h4 className="activity-name">{activity.title}</h4>
                    </div>
                    <button
                      className="add-to-grade-btn"
                      onClick={() => addActivityToGrade(activity)}
                    >
                      추가
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-results">검색 결과가 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션: 학년별 활동 관리 */}
        <div className="right-section">
          <div className="section-header">
            <div className="grade-selector">
              {[1, 2, 3, 4].map(grade => (
                <button
                  key={grade}
                  className={`grade-btn ${selectedGrade === grade ? 'active' : ''}`}
                  onClick={() => setSelectedGrade(grade)}
                >
                  {grade}학년
                </button>
              ))}
            </div>
          </div>

          <div className="selected-activities-area">
            <div className="grade-info-header">
              <h3>{selectedGrade}학년 참여 활동</h3>
              <span className="count-badge">{gradeActivities[selectedGrade]?.length || 0}</span>
            </div>

            <div className="added-activities-list">
              {gradeActivities[selectedGrade]?.length > 0 ? (
                gradeActivities[selectedGrade].map(activity => (
                  <div key={activity.id} className="added-activity-item">
                    <div className="added-item-info">
                      <span className="item-category">[{activity.category}]</span>
                      <span className="item-title">{activity.title}</span>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeActivityFromGrade(activity.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>아직 추가된 활동이 없습니다.</p>
                  <p className="hint">왼쪽 리스트에서 활동을 선택하여 추가하세요.</p>
                </div>
              )}
            </div>

            <div className="save-action-area">
              <button className="final-save-btn" onClick={handleSave}>
                전체 활동 저장하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastActivitiesPage;
