# QUANTUM API 명세

> 백엔드 구현 후 Swagger(`/docs`)가 최종 명세입니다.

---

## Base URL

```
http://localhost:8000
```

## 인증 방식

로그인 후 발급받은 JWT 토큰을 모든 인증 요청의 헤더에 포함합니다.

```
Authorization: Bearer {access_token}
```

---

## 페이지별 필요 API

| 페이지 | 경로 | 필요 API |
|--------|------|----------|
| `LoginPage` | `/login` | 로그인 |
| `SignupPage` | `/signup` | 아이디 중복 확인, 회원가입 |
| `MyInfoPage` | `/my-info` | 유저 정보 조회/수정 |
| `CareerTest` | `/test` | 검사 결과 저장 |
| `RecommendPage` | `/recommend` | 추천 활동 요청, 하트 추가/삭제 |
| `RoadmapPage` | `/roadmap` | 하트 저장 활동 조회 |
| `PastActivitiesPage` | `/past-activities` | 활동 전체 목록 조회, 학년별 활동 조회/추가/삭제 |

---

## 엔드포인트 명세

### 1. 인증 (Auth)

#### 아이디 중복 확인
```
GET /users/check-username/{id}
```
| 항목 | 내용 |
|------|------|
| 인증 | 불필요 |
| Path Param | `id` — 확인할 아이디 |
| Response (사용 가능) | `{ "available": true }` |
| Response (중복) | `{ "available": false }` |

#### 회원가입
```
POST /users/sign-up
```
| 항목 | 내용 |
|------|------|
| 인증 | 불필요 |
| Request Body | `{ "user_id": "아이디", "password": "비밀번호", "name": "이름", "school_year": 3 }` |
| Response | `true` |

#### 로그인
```
POST /users/log-in
```
| 항목 | 내용 |
|------|------|
| 인증 | 불필요 |
| Request Body | `{ "id": "아이디", "password": "비밀번호" }` |
| Response | `{ "access_token": "jwt토큰" }` |

---

### 2. 유저 정보 (MyInfoPage)

#### 내 정보 조회
```
GET /users/me
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Response | `{ "user_id": "학번", "name": "이름", "school_year": 3, "has_test_result": true, "ability_url": "url", "ability": "능력 벡터" }` |

#### 내 정보 수정
```
PUT /users/me
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ "school_year": 3 }` |
| Response | 수정된 유저 정보 |

---

### 3. 심리검사 결과 저장 (CareerTestPage)

```
POST /users/me/test-result
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ "gender": "성별", "grade": 2, "answers": 2,3,4,... }` |
| Response | `{ "success": true }` |

---
### 4. 선호 문장
```
POST /me/preference
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ "preference": "선호활동"}` |
| Response | `{ "success": true }` |

---

### 5. 활동 추천 (RecommendPage)

```
POST /activities/recommend
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | 아래 참고 |
| Response | 아래 참고 |

**Request Body**
```json
{
  "pref_weight": 50,
  "activity_weight": 50,
  "type_weight": 50
}
```

**Response**
```json
[
  {
    "activity_id": 1,
    "fitness_score": "연구활동"
  }
]
```

---

### 5. 하트 활동 추가/삭제 (RecommendPage)

> 하트 버튼 클릭 시 즉시 서버에 반영합니다.

#### 하트
```
POST /users/me/hearted-activities/{activity_id}
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Path Param | `activity_id` — 하트할 활동 ID |
| Response | `{ "success": true }` |

### 6. 하트 활동 조회 (RoadmapPage)

```
GET /users/me/hearted-activities
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Response | 추천 활동 목록과 동일한 형태 (id, category, title, description, recommendationReason, url) |

---

### 7. 활동 전체 목록 (PastActivitiesPage)

```
GET /activities
```
| 항목 | 내용 |  
|------|------|
| 인증 | 필요 |
| Query Param | `category` (선택) — `비교과 활동` / `자격증` / `학부 연구실` |
| Query Param | `search` (선택) — 검색어 (활동명 대상) |
| Response | `[{ "id": 1, "title": "데이터 분석 기초 캠프", "category": "비교과 활동" }]` |

---

### 8. 학년별 참여 활동 조회/추가/삭제 (PastActivitiesPage)

> 추가/삭제 시 즉시 서버에 반영합니다. "전체 저장" 버튼 불필요.

#### 학년별 활동 조회
```
GET /users/me/past-activities
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Response | `{ "grade1": [1, 2, 3], "grade2": [...], "grade3": [...], "grade4": [...] }` |

#### 학년별 활동 추가
```
POST /users/me/past-activities
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Path Param |  |
| Request Body | `{ "grade1": [1, 2, 3], "grade2": [...], "grade3": [...], "grade4": [...] }` |
| Response | `{ "success": true }` |

#### 학년별 활동 삭제
```
DELETE /users/me/past-activities/{activity_id}
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Path Param | `activity_id` — 삭제할 활동 ID |
| Response | `{ "success": true }` |

---

## 구현 우선순위

| 우선순위 | 엔드포인트 | 연결 페이지 |
|---------|-----------|------------|
| 🔴 필수 | `POST /users/log-in` | LoginPage |
| 🔴 필수 | `GET /users/check-username/{id}` | SignupPage |
| 🔴 필수 | `POST /users/sign-up` | SignupPage |
| 🔴 필수 | `GET /users/me` | MyInfoPage |
| 🔴 필수 | `GET /activities` | PastActivitiesPage |
| 🔴 필수 | `GET /users/me/past-activities` | PastActivitiesPage |
| 🔴 필수 | `POST /users/me/past-activities/{activity_id}` | PastActivitiesPage |
| 🔴 필수 | `DELETE /users/me/past-activities/{activity_id}` | PastActivitiesPage |
| 🔴 필수 | `POST /activities/recommend` | RecommendPage |
| 🟡 중요 | `PUT /users/me` | MyInfoPage |
| 🟡 중요 | `POST /users/me/test-result` | CareerTestPage |
| 🟡 중요 | `POST /users/me/hearted-activities/{activity_id}` | RecommendPage |
| 🟡 중요 | `DELETE /users/me/hearted-activities/{activity_id}` | RecommendPage |
| 🟢 이후 | `GET /users/me/hearted-activities` | RoadmapPage |
