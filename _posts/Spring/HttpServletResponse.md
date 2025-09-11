---
aliases:
  - HttpServletResponse
tags:
  - Servlet
  - Spring
  - Java
---
# HttpServletResponse 
## 역활
- HTTP 응답 메시지 생성
	- HTTP 응답코드 지정
	- 헤더 생성
	- 바디 생성
- 편의기능 제공
	- Content-Type
	- 쿠키
	- Redirect

### 기본 적인 사용 방법
```java
// status-line  
resp.setStatus(HttpServletResponse.SC_OK);  
  
// response-header  
resp.setHeader("Content-Type", "text/plain;charset=utf-8");
resp.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");  
resp.setHeader("Pragma", "no-cache");  
resp.setHeader("my-header", "hello");

// message body  
resp.getWriter().write("ok");
```
### 동일한 Content-Type 지정 방법
```java
resp.setHeader("Content-Type", "text/plain;charset=utf-8");
```
---
```java
resp.setContentType("text/plain");  
resp.setCharacterEncoding("utf-8");
```
### 특정 쿠키 저장 방법
```java
Cookie cookie = new Cookie("myCookie", "good");  
cookie.setMaxAge(600); // 600초  
resp.addCookie(cookie);
```
### redirect 방법 (위 아래 동일한 방법)
```java
resp.setStatus(HttpServletResponse.SC_FOUND); // 302  
resp.setHeader("Location", "/basic/hello-form.html");  
```
---
```java
resp.sendRedirect("/basic/hello-form.html");
```
### HTML 을 보내는 방법
```java
resp.setContentType("text/html");  
resp.setCharacterEncoding("utf-8");  
  
// message body에 html 태그를 넣어서 보내면 브라우저가 html로 인식한다.  
resp.getWriter().write("<html>");  
resp.getWriter().write("<body>");  
resp.getWriter().write("<div>안녕?</div>");  
resp.getWriter().write("</body>");  
resp.getWriter().write("</html>");
```
### JSON 보내는 방법
```java
// Content-Type: application/json;charset=utf-8  
resp.setContentType("application/json");  
resp.setCharacterEncoding("utf-8");  
  
// {"username": "kim", "age": 20}  
// resp.getWriter().write("{\"username\": \"kim\", \"age\": 20}");  
resp.getWriter().write(objectMapper.writeValueAsString(new HelloData("kim", 20)));
```
### ![[2.Ref(데이터 및 정보 저장)/Spring/HTTP/Cache-Control#2.Ref(데이터 및 정보 저장)/Spring/HttpServletResponse HttpServletResponse 방법|Cache-Control 사용 방법]] 


