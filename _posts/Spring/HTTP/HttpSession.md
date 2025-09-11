---
aliases:
  - "\bHttpSession"
tags:
  - Spring
  - Spring/Session
  - Spring/Cookie
특징: 
---
# HttpSession


```java
public interface HttpSession {
  // 세션 생성 시간
  long getCreationTime();
  // JSESSIONID
  String getId();
  // 마지막 세션 접근 시간
  long getLastAccessedTime();
  // 현재 세션과 연관된 ServletContext 를 반환
  ServletContext getServletContext();
  // 세션 최대 비활성화 시간 설정, 이 시간 동안 클라이언트가 서버에 요청을 보내지 않으면 세션은 무효화, 시간은 초 단위
  void setMaxInactiveInterval(int var1);
  // 세션 최대 비활성화 시간 반환
  int getMaxInactiveInterval();
  // 주어진 이름의 속성값 반환(없으면 null)
  Object getAttribute(String var1);
  // 세션에 저장된 모든 속성의 이름을 Enumeration<String> 타입으로 반환
  Enumeration<String> getAttributeNames();
  // 세션에 속성값을 설정(동일한 이름의 속성이 이미 있으면 덮어씀)
  void setAttribute(String var1, Object var2);
  // 세션에 저장된 속성값을 제거
  void removeAttribute(String var1);
  // 세션 무효화
  void invalidate();
   // 세션이 새로 생성된 것인지 확인
  boolean isNew();
}
```

```java
log.info("sessionId={}", session.getId());  // 세션 ID
log.info("maxInactiveInterval={}", session.getMaxInactiveInterval());  // 세션유효시간 초 단위
log.info("creationTime={}", new Date(session.getCreationTime()));  // 세션 생성일
log.info("lastAccessedTime={}", session.getLastAccessedTime()); // 마지막 세션의 접근 시간  
log.info("isNew={}", session.isNew() );// 새로 생성한 세션인지 이미 과거에 만들어진 세션인지
```
> 세션 정보

```text
session name=loginMember, value=Member(id=1, loginId=qwe, name=qwe, password=qwe)  
sessionId=3824B6752DAC8FED8C2E3385ACFB4B1E  
maxInactiveInterval=1800  
creationTime=Wed Jan 31 16:11:58 KST 2024  
lastAccessedTime=1706685118726  
isNew=false
```

```properties
# 세션 유효시간 설정 (초단위 설정) == setMaxInactiveInterval()
server.servlet.session.timeout=60
```
> application.properties