# QUANTUM API 명세 (초안)

> `career-test` 프론트엔드 코드 분석 기반으로 작성된 초안입니다.
> 백엔드 구현 후 Swagger(`/docs`)가 최종 명세가 됩니다.

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
| `CareerTest` | `/test` | (커리어넷 외부 API 직접 호출 후) 검사 결과 저장 |
| `RecommendPage` | `/recommend` | 추천 활동 요청 (가중치 포함) |
| `RoadmapPage` | `/roadmap` | 하트 저장 활동 조회 |
| `PastActivitiesPage` | `/past-activities` | 활동 전체 목록 조회, 학년별 활동 저장/조회 |

---

## 엔드포인트 명세

### 1. 인증 (Auth)

#### 아이디 중복 확인 —
```
GET /users/check-username
```
| 항목 | 내용 |
|------|------|
| 인증 | 불필요 |
| Query Param | `username` — 확인할 아이디 |
| Response (사용 가능) | `{ "available": true }` |
| Response (중복) | `{ "available": false }` |

> SignupPage의 "중복 확인" 버튼에서 호출합니다.

#### 회원가입 
```
POST /users/sign-up
```
| 항목 | 내용 |
|------|------|
| 인증 | 불필요 |
| Request Body | `{ "username": "학번", "password": "비밀번호", "name": "이름", "year": 3 }` |
| Response | `true` |

> ⚠️ 현재 백엔드는 `username`, `password`만 받음. `name`, `year` 필드 추가 필요.

#### 로그인
```
POST /users/log-in
```
| 항목 | 내용 |
|------|------|
| 인증 | 불필요 |
| Request Body | `{ "username": "학번", "password": "비밀번호" }` |
| Response | `{ "access_token": "jwt토큰" }` |

---

### 2. 유저 정보 (MyInfoPage)

> 표시 항목: 아이디(`id`), 이름(`name`), 학년(`year`), 검사 결과 여부

#### 내 정보 조회
```
GET /users/me
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Response | `{ "id": "학번", "name": "이름", "year": 3, "has_test_result": true, "ability_url": "url" }` |

#### 내 정보 수정
```
PUT /users/me
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ "name": "이름", "year": 3 }` |
| Response | 수정된 유저 정보 |

> ⚠️ 현재 프론트에서 아이디도 수정 가능한 UI이나, 보안상 아이디 수정은 별도 검토 필요.

---

### 3. 심리검사 결과 저장 (CareerTestPage)

> **흐름**: 커리어넷 외부 API를 프론트에서 직접 호출 → 결과 URL을 백엔드에 저장
>
> - 문항 로딩: `GET /api/inspct/openapi/test/questions` (커리어넷, vite proxy 경유)
> - 결과 제출: `POST /api/inspct/openapi/test/report` (커리어넷, vite proxy 경유)
> - 커리어넷에서 `result.url` 반환 → 아래 엔드포인트로 백엔드에 저장

```
POST /users/me/test-result
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ "ability_url": "커리어넷 결과 리포트 URL" }` |
| Response | `{ "success": true }` |

> ⚠️ 현재 프론트에는 백엔드 저장 로직 미연결 — 결과 URL을 받은 후 저장 버튼/자동 저장 UX 구현 필요.

---

### 4. 활동 추천 (RecommendPage)

> **흐름**: 유저가 관심 문장 입력 + 가중치(선호 문장 / 과거 활동 / 유형 결과) 조정 → 추천 결과 5개 반환
>
> 추천 결과 카드에서 하트 토글 가능 (현재 localStorage 관리, 백엔드 연동 시 아래 API 사용)

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
  "preference": "데이터 분석 역량을 키워서 IT 서비스 기획자가 되고 싶어요.",
  "pref_weight": 50,
  "activity_weight": 50,
  "type_weight": 50
}
```

| 필드 | 설명 | 범위 |
|------|------|------|
| `preference` | 관심 활동/목표 자유 문장 (최소 5자, 최대 200자) | 문자열 |
| `pref_weight` | 선호 문장 반영 비율 슬라이더 값 | 1 ~ 100 |
| `activity_weight` | 과거 활동 반영 비율 슬라이더 값 | 1 ~ 100 |
| `type_weight` | 유형 결과 반영 비율 슬라이더 값 | 1 ~ 100 |

**Response**
```json
[
  {
    "id": 1,
    "category": "연구활동",
    "title": "교내 URP 프로그램",
    "description": "교수님과 함께하는 학부생 연구 기회입니다.",
    "recommendationReason": "관심 분야인 AI 연구에 대한 실무 경험을 쌓기에 가장 적합한 활동입니다.",
    "url": "https://..."
  }
]
```

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | number | 활동 고유 ID |
| `category` | string | 활동 카테고리 (아래 참고) |
| `title` | string | 활동명 |
| `description` | string | 활동 설명 |
| `recommendationReason` | string | AI 추천 이유 |
| `url` | string | 활동 상세 링크 |

> `category` 값: `"연구활동"` | `"자기계발"` | `"공모전"` | `"인턴십"` | `"스터디"` | `"비교과 활동"` | `"자격증"` | `"학부 연구실"`
> (확정 전 — 백엔드 DB의 카테고리 분류와 통일 필요)

---

### 5. 하트 활동 저장/조회 (RoadmapPage)

> 현재 프론트는 localStorage로 관리 중. 백엔드 연동 시 아래 API 필요.
>
> RoadmapPage에서는 하트된 활동 목록을 추천 결과와 동일한 형태로 표시합니다.

#### 하트 활동 저장
```
POST /users/me/hearted-activities
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ "activity_ids": [1, 3, 5] }` |
| Response | `{ "success": true }` |

#### 하트 활동 조회
```
GET /users/me/hearted-activities
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Response | 추천 활동 목록과 동일한 형태 (id, category, title, description, recommendationReason, url) |

---

### 6. 활동 전체 목록 (PastActivitiesPage)

> 왼쪽 패널에서 카테고리 필터 + 검색으로 활동 목록 조회
>
> 카테고리 필터: 전체 / 비교과 활동 / 자격증 / 학부 연구실

```
GET /activities
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Query Param | `category` (선택) — `비교과 활동` / `자격증` / `학부 연구실` |
| Query Param | `search` (선택) — 검색어 (활동명 대상) |
| Response | 아래 참고 |

```json
[
  {
    "id": 1,
    "title": "데이터 분석 기초 캠프",
    "category": "비교과 활동"
  }
]
```

> ⚠️ 현재 PastActivitiesPage에서 사용하는 필드는 `id`, `title`, `category` 3개만 필요.
> 상세 정보(설명, URL 등)는 현재 UI에서 미표시 — 추후 모달 등 추가 시 필드 확장.

---

### 7. 학년별 참여 활동 저장/조회 (PastActivitiesPage)

> 오른쪽 패널에서 학년(1~4학년) 탭 선택 후 활동을 추가/삭제, "전체 활동 저장하기" 버튼으로 일괄 저장

#### 학년별 활동 저장
```
POST /users/me/past-activities
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ "grade_activities": { "1": [1, 2], "2": [3], "3": [4, 5], "4": [] } }` |
| Response | `{ "success": true }` |

> `grade_activities` 값은 activity id 배열. 빈 학년은 빈 배열 `[]`로 전송.

#### 학년별 활동 조회
```
GET /users/me/past-activities
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Response | `{ "grade_activities": { "1": [{id, title, category}], "2": [...], "3": [...], "4": [...] } }` |

---

## 구현 우선순위

| 우선순위 | 엔드포인트 | 연결 페이지 |
|---------|-----------|------------|
| 🔴 필수 | `POST /users/log-in` | LoginPage (기구현) |
| 🔴 필수 | `POST /users/sign-up` (필드 추가) | SignupPage (기구현, name/year 추가 필요) |
| 🔴 필수 | `GET /users/check-username` | SignupPage |
| 🔴 필수 | `GET /users/me` | MyInfoPage |
| 🔴 필수 | `POST /activities/recommend` | RecommendPage |
| 🔴 필수 | `GET /activities` | PastActivitiesPage |
| 🟡 중요 | `PUT /users/me` | MyInfoPage |
| 🟡 중요 | `POST /users/me/test-result` | CareerTestPage |
| 🟡 중요 | `POST /users/me/past-activities` | PastActivitiesPage |
| 🟡 중요 | `GET /users/me/past-activities` | PastActivitiesPage |
| 🟢 이후 | `POST /users/me/hearted-activities` | RoadmapPage |
| 🟢 이후 | `GET /users/me/hearted-activities` | RoadmapPage |
