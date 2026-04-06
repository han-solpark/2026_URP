# QUANTUM API 명세 (초안)


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

| 페이지 | 화면 목적 | 필요 API |
|--------|----------|----------|
| `home.htm` | 랜딩 | 로그인 상태 확인 |
| `myinfo.htm` | 나의 기록 | 유저 정보 조회/수정 |
| `recommend.htm` | 활동 추천 | 추천 활동 목록 |
| `roadmap.htm` | 로드맵 | 활동 전체 목록 |
| `test.htm` | 직업흥미검사 | 검사 결과 저장 |

---

## 엔드포인트 명세

### 1. 인증 (Auth) — 기구현 ✅

#### 회원가입
```
POST /users/sign-up
```
| 항목 | 내용 |
|------|------|
| 인증 | 불필요 |
| Request Body | `{ "username": "학번", "password": "비밀번호" }` |
| Response | `true` |

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

### 2. 유저 정보 (myinfo.htm)

#### 내 정보 조회
```
GET /users/me
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Response | `{ "id": "학번", "name": "이름", "year": 3, "ability": {...}, "ability_url": "url", "preference_char": [...] }` |

#### 내 정보 수정
```
PUT /users/me
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ "name": "이름", "year": 3 }` |
| Response | 수정된 유저 정보 |

---

### 3. 심리검사 결과 저장 (test.htm)

> 커리어넷 API를 프론트에서 직접 호출 후, 결과를 백엔드에 저장하는 구조

```
POST /users/me/test-result
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ "ability": { ... }, "ability_url": "커리어넷 결과 리포트 URL" }` |
| Response | `{ "success": true }` |

---

### 4. 활동 추천 (recommend.htm)

> 유저의 검사 결과 및 선호도를 기반으로 코사인 유사도 상위 5개 활동 반환

```
GET /activities/recommend
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Response | 아래 참고 |

```json
[
  {
    "id": 1,
    "name": "홍길동 교수님 - AI Lab",
    "category": "lab",
    "detail": "소프트웨어학과, AI분야",
    "url": "https://...",
    "score": 0.92
  }
]
```

`category` 값: `"lab"` | `"notice"` | `"certification"`

---

### 5. 활동 전체 목록 (roadmap.htm)

```
GET /activities
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Query Param | `category` (선택) — `lab` / `notice` / `certification` |
| Response | 아래 참고 |

```json
[
  {
    "id": 1,
    "name": "...",
    "category": "...",
    "detail": "...",
    "url": "...",
    "written_date": "2025-03-01"
  }
]
```

---

### 6. 선호도 입력

```
POST /users/me/preference
```
| 항목 | 내용 |
|------|------|
| 인증 | 필요 |
| Request Body | `{ "preference_char": ["AI", "데이터분석", "연구"] }` |
| Response | `{ "success": true }` |

---

## 구현 우선순위

| 엔드포인트 | 연결 페이지 |
|-----------|------------|
| `GET /users/me` | myinfo.htm |
| `GET /activities/recommend` | recommend.htm |
| `POST /users/me/test-result` | test.htm |
| `PUT /users/me` | myinfo.htm |
| `GET /activities` | roadmap.htm |
| `POST /users/me/preference` | 선호도 설정 |
