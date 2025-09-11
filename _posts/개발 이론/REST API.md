---
aliases:
  - REST API
tags:
  - 개발/개발이론
  - HTTP
---
# REST API
- 특정한 설계 규칙을 지키는 것
## 주요 원칙
- **무상태(Stateless)**: 각 요청은 독립적이어야 함
- **자원 중심**: URL이 자원을 나타내야 함 (`/users/123`)
- **HTTP 메소드 활용**: GET, POST, PUT, DELETE 등을 의미에 맞게 사용
- **표현**: JSON, XML 등으로 데이터 표현
- **계층화**: 클라이언트는 서버 구조를 알 필요 없음
## RPC(Remote Procedure Call) 스타일
- `RESTful RPC` / `REST-like RPC` / `REST-ish` / `Pragmatic REST` 등으로 표현
- 리소스 중심인 REST와 달리 동작 줌심으로 설계
- REST API 원칙과는 벗어났지만 실무에서 현실적인 요구로 인해 어쩔수 없는 사용