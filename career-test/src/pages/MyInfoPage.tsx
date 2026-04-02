import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './MyInfoPage.css';

const MyInfoPage = () => {
  const navigate = useNavigate();
  // 사용자가 이미 검사를 했다고 가정 (프리뷰를 위해 true로 설정)
  const hasTestResult = true; 

  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: 'user123',
    name: '김민채',
    university: '한국대학교',
    grade: '3학년'
  });

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    if (isEditing) {
      // 저장 로직 (API 호출 등)
      console.log('Saved:', userInfo);
    }
    setIsEditing(!isEditing);
  };

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
              {isEditing ? (
                <>
                  <label>아이디</label>
                  <input 
                    type="text" 
                    name="id" 
                    value={userInfo.id} 
                    onChange={handleInfoChange} 
                    placeholder="아이디를 입력하세요"
                  />
                </>
              ) : (
                <div className="info-row">
                  <span className="info-tag">아이디:</span>
                  <span className="info-text">{userInfo.id}</span>
                </div>
              )}
            </div>
            <div className="info-item">
              {isEditing ? (
                <>
                  <label>이름</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={userInfo.name} 
                    onChange={handleInfoChange} 
                    placeholder="이름을 입력하세요"
                  />
                </>
              ) : (
                <div className="info-row">
                  <span className="info-tag">이름:</span>
                  <span className="info-text">{userInfo.name}</span>
                </div>
              )}
            </div>
            <div className="info-item">
              {isEditing ? (
                <>
                  <label>대학교</label>
                  <input 
                    type="text" 
                    name="university" 
                    value={userInfo.university} 
                    onChange={handleInfoChange} 
                    placeholder="대학교를 입력하세요"
                  />
                </>
              ) : (
                <div className="info-row">
                  <span className="info-tag">대학교:</span>
                  <span className="info-text">{userInfo.university}</span>
                </div>
              )}
            </div>
            <div className="info-item">
              {isEditing ? (
                <>
                  <label>학년</label>
                  <select 
                    name="grade" 
                    value={userInfo.grade} 
                    onChange={handleInfoChange}
                    className="grade-select"
                  >
                    <option value="1학년">1학년</option>
                    <option value="2학년">2학년</option>
                    <option value="3학년">3학년</option>
                    <option value="4학년">4학년</option>
                    <option value="기타">기타</option>
                  </select>
                </>
              ) : (
                <div className="info-row">
                  <span className="info-tag">학년:</span>
                  <span className="info-text">{userInfo.grade}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션: 유형 검사 결과 */}
        <div className="right-panel">
          <div className="section-group">
            <h2>내 유형</h2>
            {hasTestResult ? (
              <div className="result-card">
                <div className="chart-placeholder">[유형 분석 차트]</div>
                <button onClick={() => navigate('/test')}>재검사하기</button>
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