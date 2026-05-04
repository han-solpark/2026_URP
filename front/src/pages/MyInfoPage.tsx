import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api';
import Loading from '../components/Loading';
import './MyInfoPage.css';

const MyInfoPage = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    id: '',
    name: '',
    school_year: 0,
    has_test_result: false,
    ability_url: '',
  });
  const [editGrade, setEditGrade] = useState('');

  useEffect(() => {
    api.get('/users/me').then(data => {
      setUserInfo({
        id: String(data.user_id),
        name: data.name,
        school_year: data.school_year,
        has_test_result: data.has_test_result,
        ability_url: data.ability_url || '',
      });
      setEditGrade(String(data.school_year));
    }).finally(() => setLoading(false));
  }, []);

  const toggleEdit = async () => {
    if (isEditing) {
      setLoading(true);
      await api.put('/users/me', { school_year: Number(editGrade) });
      setUserInfo(prev => ({ ...prev, school_year: Number(editGrade) }));
      setLoading(false);
    }
    setIsEditing(!isEditing);
  };

  if (loading) return <Loading />;

  return (
    <div className="my-info-page">
      <div className="my-info-container">
        {/* 왼쪽 섹션: 개인 정보 */}
        <div className="left-panel">
          <div className="title-row">
            <h2>내 정보</h2>
            <button className="edit-toggle-btn" onClick={toggleEdit}>
              {isEditing ? '저장' : '수정'}
            </button>
          </div>

          <div className="info-card">
            <div className="info-item">
              <div className="info-row">
                <span className="info-tag">아이디:</span>
                <span className="info-text">{userInfo.id}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-row">
                <span className="info-tag">이름:</span>
                <span className="info-text">{userInfo.name}</span>
              </div>
            </div>
            <div className="info-item">
              {isEditing ? (
                <>
                  <label>학년</label>
                  <select
                    value={editGrade}
                    onChange={(e) => setEditGrade(e.target.value)}
                    className="grade-select"
                  >
                    <option value="1">1학년</option>
                    <option value="2">2학년</option>
                    <option value="3">3학년</option>
                    <option value="4">4학년</option>
                  </select>
                </>
              ) : (
                <div className="info-row">
                  <span className="info-tag">학년:</span>
                  <span className="info-text">{userInfo.school_year}학년</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션: 유형 검사 결과 */}
        <div className="right-panel">
          <div className="section-group">
            <h2>내 유형</h2>
            {userInfo.has_test_result ? (
              <div className="result-card">
                <div className="chart-placeholder">[유형 분석 차트]</div>
                <div className="button-group">
                  <button
                    className="report-btn"
                    onClick={() => window.open(userInfo.ability_url, '_blank')}
                  >
                    결과 리포트 보기
                  </button>
                  <button className="retest-btn" onClick={() => navigate('/test')}>
                    다시 검사하기
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-result-card">
                <p>정보가 없습니다. 검사를 실시하세요.</p>
                <button onClick={() => navigate('/test')}>검사하기</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInfoPage;
