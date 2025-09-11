---
aliases:
  - HttpServletRequest
tags:
  - Servlet
  - Spring
  - Java
---

# HttpServletRequest
- HTTP 요청 메시지 파싱
- 임시 저장소 기능
	- 해당 HTTP 요청이 시작부터 끝날 때 까지 유지되는 임시 저장소 기능
	- 저장 : `request.setAttribute(name, value)`
	- 조회 : `request.getAttribute(name)`
- 세션 관리 기능
	- `request.getSession(create: true)`

> [!tip] HTTP 스펙이 제공하는 요청, 응답 메시지 자체를 이해
> HttpServletRequest, HttpServletResponse 들은 모두 HTTP 메세지를 편리하게 사용하도록 만들어진 것이기에 HTTP 스펙을 아는 것이 중요

### HttpServletRequest Line 조회 방법
```Java
System.out.println("--- REQUEST-LINE - start ---");  
System.out.println("req.getMethod() = " + req.getMethod()); // GET  
System.out.println("req.getProtocol() = " + req.getProtocol()); // HTTP/1.1  
System.out.println("req.getScheme() = " + req.getScheme()); // http  
  
// http://localhost:8080/request-header?username=hello&age=20  
System.out.println("req.getRequestURL() = " + req.getRequestURL()); // http://localhost:8080/request-header  
System.out.println("req.getRequestURI() = " + req.getRequestURI()); // /request-test  
System.out.println("req.getQueryString() = " + req.getQueryString()); // username=hello&age=20  
System.out.println("req.getServerName() = " + req.getServerName()); // Host 헤더  
System.out.println("req.getServerPort() = " + req.getServerPort()); // Host 헤더
System.out.println("req.isSecure() = " + req.isSecure()); // https 사용 유무  
System.out.println("--- REQUEST-LINE - end ---");  
System.out.println();
```

### HttpServletRequest Header 조회 방법
```java
System.out.println("--- REQUEST-HEADER - start ---");  
req.getHeaderNames().asIterator()  
        .forEachRemaining(headerName -> System.out.println(headerName + ": " + req.getHeader(headerName)));  
System.out.println("--- REQUEST-HEADER - end ---");  
System.out.println();
```

### Body 조회 방법
#### HttpServletRequest Parameter 조회
> parameter 정보는 get 방식의 parameter 형식 또한 동일하게 분석을 진행
> `Content-Type : application/x-www-form-urlencoded` 또한 동일하게 분석 진행
```java
System.out.println("--- REQUEST-BODY - start ---");  
req.getParameterNames().asIterator()  
        .forEachRemaining(paramName -> System.out.println(paramName + ": " + req.getParameter(paramName)));  
System.out.println("--- REQUEST-BODY - end ---");  
System.out.println();
```
> [!danger] 중복된 Parameter Name을 사용할 경우
```java
String[] usernames = req.getParameterValues("username");
```

#### InputStream 으로 데이터 읽는 방법
```java
ServletInputStream inputStream = req.getInputStream();  
String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);  
  
System.out.println("messageBody = " + messageBody);
```
#### JSON 으로 데이터 읽는 방법
```java
ServletInputStream inputStream = req.getInputStream();  
String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);  
  
HelloData helloData = objectMapper.readValue(messageBody, HelloData.class);  
System.out.println("helloData = " + helloData);
```

#### Accept-Language 조회 방법
```java
System.out.println("[Accept-Language 편의 조회]");  
req.getLocales().asIterator()  
        .forEachRemaining(locale -> System.out.println("locale = " + locale));  
System.out.println("req.getLocale() = " + req.getLocale());  
System.out.println();
```

#### Cookie 조회 방법
```java
System.out.println("[cookie 편의 조회]");  
if (req.getCookies() != null) {  
  for (var cookie : req.getCookies()) {  
    System.out.println(cookie.getName() + ": " + cookie.getValue());  
  }  
}  
System.out.println();
```

#### Content 조회 방법
```java
System.out.println("[Content 편의 조회]");  
System.out.println("req.getContentType() = " + req.getContentType());  
System.out.println("req.getContentLength() = " + req.getContentLength());  
System.out.println("req.getCharacterEncoding() = " + req.getCharacterEncoding());  
System.out.println("--- Header 편의 조회 end ---");  
System.out.println();
```

#### Remote 조회 방법
```java
System.out.println("[Remote 정보]");
System.out.println("req.getRemoteHost() = " + req.getRemoteHost()); // 클라이언트 IP
System.out.println("req.getRemoteAddr() = " + req.getRemoteAddr()); // 클라이언트 IP
System.out.println("req.getRemotePort() = " + req.getRemotePort()); // 클라이언트 포트
System.out.println();
```

#### Local 조회 방법
```java
System.out.println("[Local 정보]");
System.out.println("req.getLocalName() = " + req.getLocalName()); // 내 서버 IP
System.out.println("req.getLocalAddr() = " + req.getLocalAddr()); // 내 서버 IP
System.out.println("req.getLocalPort() = " + req.getLocalPort()); // 내 서버 포트
System.out.println();
```

#### 특정 jsp 호출
> `dispatcher.forward(req, resp);` 다른 서블릿이나 JSP로 내부적으로 호출하여 전달
``` java
// req.getRequestDispatcher(viewPath).forward(req, resp);  
RequestDispatcher dispatcher = req.getRequestDispatcher(viewPath);  
dispatcher.forward(req, resp);
```
> [!warning] redirect 와 forward 는 다름
> redirect 는 클라이언트에게 특정 주소로 다시 요청하라는 의미
> forward 는 서버 내부에서 호출

