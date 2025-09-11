---
aliases:
  - TrackingModes
tags:
  - Spring
  - Spring/Cookie
  - Spring/Configration
특징: 
---
# TrackingModes
Spring Boot에서 세션추적[^1] 모드를 설정하는 데 사용되는 속성 

[^1]: 웹 서버가 클라이언트의 상태를 유지하거나 추적하는 방법

> [!warning] 문제점
처음 로그인할 때 url 로 이렇게 붙는 것을 확인
`http://localhost:8080/;jsessionid=E90A4BC36A1CF128AB70AB05A32D5147`
이게 붙는 이유는 웹 브라우저가 쿠키를 지원하지 않을 경우 쿠키 대신 URL을 통해서 세션을 유지하는 방법

## 세션 추적 모드
- `COOKIE`: ==default== 세션 ID를 쿠키에 저장하여 클라이언트의 세션을 추적
- `URL`: 세션 ID를 URL에 포함시켜 세션을 추적 (쿠키를 지원하지 않는 클라이언트에 사용)
- `SSL`: SSL 세션 ID를 사용하여 클라이언트의 세션을 추적

해당 모드는 콤마(,)로 구분하며 여러 추적 모드를 동시에 사용 가능
```properties
server.servlet.session.tracking-modes=cookie,url
```