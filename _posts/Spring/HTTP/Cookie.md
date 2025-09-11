---
aliases:
  - Cookie
  - 쿠키
tags:
  - Spring
  - HTTP/Cookie
  - Spring/Cookie
특징: 
---
# 쿠키
사용자 브라우저에서 저장하는 텍스트 파일
이 파일은 클라이언트가 서버로 방문할 때마다 전송

```java
// import javax.servlet.http.Cookie
Cookie cookie = new Cookie("cookieName", "cookieValue");
cookie.setMaxAge(60 * 60); // 유효시간 설정(초 단위 설정)
response.addCookie(cookie); // 클라이언트에게 전달
Cookie[] cookies = request.getCookies(); // 모든 쿠키 목록 가져오기
```


## 쿠키의 종류
- 영속 쿠키
- 세션 쿠키

## 영속 쿠키
만료 날짜가 설정된 쿠키

## 세션 쿠키
쿠키에 시간 정보를 주지 않으면 세션 쿠키(브라우저 종료시 모두 종료)가 된다
개발자 도구에서 애플리케이션을 선택하면 확인 가능
[[2.Ref(데이터 및 정보 저장)/Spring/HTTP/HttpSession|HttpSession]] 을 통해서 서버에서 컨트롤
[[2.Ref(데이터 및 정보 저장)/Spring/HTTP/TrackingModes|TrackingModes]]를 활용하여 세션 추적 모드를 설정하는데 사용









