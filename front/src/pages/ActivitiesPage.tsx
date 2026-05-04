import { useState, useEffect } from 'react';
import { api } from '../api';

interface Activity {
  activity_id: number;
  title: string;
  category: string;
  source_url: string | null;
  detail: string | null;
  proper_school_year: string | null;
}

const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  useEffect(() => {
    api.get('/activities').then((data: Activity[]) => {
      setActivities(data);
    }).finally(() => setLoading(false));
  }, []);

  const categories = ['전체', ...Array.from(new Set(activities.map(a => a.category).filter(Boolean)))];
  const filtered = selectedCategory === '전체'
    ? activities
    : activities.filter(a => a.category === selectedCategory);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>불러오는 중...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px 20px' }}>
      <h2 style={{ marginBottom: '8px' }}>전체 활동 목록</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>총 {activities.length}개의 활동이 있습니다.</p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              cursor: 'pointer',
              backgroundColor: selectedCategory === cat ? '#5b7a8c' : '#fff',
              color: selectedCategory === cat ? '#fff' : '#333',
              fontWeight: selectedCategory === cat ? 'bold' : 'normal',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map(activity => (
          <div
            key={activity.activity_id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '20px',
              backgroundColor: '#fff',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <span style={{
                  fontSize: '12px',
                  backgroundColor: '#eef4f7',
                  color: '#5b7a8c',
                  padding: '3px 10px',
                  borderRadius: '10px',
                  marginRight: '8px',
                }}>
                  {activity.category}
                </span>
                {activity.proper_school_year && (
                  <span style={{
                    fontSize: '12px',
                    backgroundColor: '#f5f5f5',
                    color: '#888',
                    padding: '3px 10px',
                    borderRadius: '10px',
                  }}>
                    {activity.proper_school_year}학년 권장
                  </span>
                )}
                <h4 style={{ margin: '10px 0 6px' }}>{activity.title}</h4>
                {activity.detail && (
                  <p style={{ color: '#666', fontSize: '14px', margin: 0, lineHeight: 1.6 }}>
                    {activity.detail.length > 120 ? activity.detail.slice(0, 120) + '...' : activity.detail}
                  </p>
                )}
              </div>
              {activity.source_url && (
                <a
                  href={activity.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: '16px',
                    padding: '8px 16px',
                    backgroundColor: '#5b7a8c',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  바로가기 ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesPage;
