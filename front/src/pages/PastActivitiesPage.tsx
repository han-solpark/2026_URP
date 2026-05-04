import { useState, useMemo, useEffect } from 'react';
import { api } from '../api';
import Loading from '../components/Loading';
import './PastActivitiesPage.css';

interface Activity {
  activity_id: number;
  title: string;
  category: string;
}

const PastActivitiesPage = () => {
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [gradeActivities, setGradeActivities] = useState<Record<number, Activity[]>>({
    1: [], 2: [], 3: [], 4: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/activities'),
      api.get('/users/me/past-activities'),
    ]).then(([activitiesData, pastData]: [Activity[], { grade1: number[] | null, grade2: number[] | null, grade3: number[] | null, grade4: number[] | null }]) => {
      setAllActivities(activitiesData);

      if (pastData) {
        const toActivities = (ids: number[] | null) =>
          (ids ?? []).map(id => activitiesData.find(a => a.activity_id === id)).filter(Boolean) as Activity[];

        setGradeActivities({
          1: toActivities(pastData.grade1),
          2: toActivities(pastData.grade2),
          3: toActivities(pastData.grade3),
          4: toActivities(pastData.grade4),
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() =>
    ['전체', ...Array.from(new Set(allActivities.map(a => a.category).filter(Boolean)))],
    [allActivities]
  );

  const filteredActivities = useMemo(() => {
    let result = allActivities;
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
  }, [searchQuery, allActivities, selectedCategory]);

  const addActivityToGrade = (activity: Activity) => {
    setGradeActivities(prev => {
      const current = prev[selectedGrade] || [];
      if (current.find(a => a.activity_id === activity.activity_id)) {
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
      [selectedGrade]: prev[selectedGrade].filter(a => a.activity_id !== activityId),
    }));
  };

  const handleSave = async () => {
    await api.post('/users/me/past-activities', {
      grade1: gradeActivities[1].map(a => a.activity_id),
      grade2: gradeActivities[2].map(a => a.activity_id),
      grade3: gradeActivities[3].map(a => a.activity_id),
      grade4: gradeActivities[4].map(a => a.activity_id),
    });
    alert('활동 기록이 저장되었습니다.');
  };

  if (loading) return <Loading />;

  return (
    <div className="past-activities-page-v2">
      <div className="activities-layout">
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
                  <div key={activity.activity_id} className="activity-card-v2">
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
                  <div key={activity.activity_id} className="added-activity-item">
                    <div className="added-item-info">
                      <span className="item-category">[{activity.category}]</span>
                      <span className="item-title">{activity.title}</span>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeActivityFromGrade(activity.activity_id)}
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
