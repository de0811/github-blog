---
aliases:
  - JSP
tags:
  - JSP
  - Spring
  - spring/ViewTemplate
---
## 의존성
```groovy
//implementation 'javax.servlet:jstl' //스프링부트 3.0 미만  
implementation 'jakarta.servlet:jakarta.servlet-api' //스프링부트 3.0 이상  
implementation 'jakarta.servlet.jsp.jstl:jakarta.servlet.jsp.jstl-api' //스프링부트 3.0 이상  
implementation 'org.glassfish.web:jakarta.servlet.jsp.jstl' //스프링부트 3.0 이
```

## 문법
### `<% ... %>`
- 자바 코드를 정의 하는 부분
### `<%= ... %>`
- 자바 코드를 출력 하는 부분
### `${member.username}`
- `req.setAttribute("member", memberRepository.findById(1L));`넘긴 member를 사용할때 쓰는 방법
