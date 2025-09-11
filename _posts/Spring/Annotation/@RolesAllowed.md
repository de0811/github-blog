---
aliases:
  - "@RolesAllowed"
tags:
  - Spring
  - Spring/Security
  - Annotation
  - JSR-250
특징: 
---
# @RolesAllowed
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ EnableMethodSecurity|@EnableGlobalMethodSecurity(jsr250Enabled = true)]] 설정이 활성화된 경우에만 사용 가능
역활(권한) 목록을 지정 가능
이 역활 목록 중 하나 이상을 가진 사용자만 해당 메서드를 호출 가능

인증되지 않는 용자가 호출하게 되면  `AuthenticationCredentialsNotFoundException` 에러 발생
권한이 없는 사용자가 호출하게 되면 `AccessDeniedException` 에러 발생

[[JSR-250]] 제공하는 어노테이션

[[SpEL (Spring Expression Language)]] 표현식 사용할 수 없음


```java
@RolesAllowed("ADMIN")
public void deleteAllUsers() {
    // ...
}
```
> `'ADMIN'` 역할을 가진 사용자만 `deleteAllUsers()` 메서드를 호출할 수 있도록 지정

```java
@RolesAllowed({"ADMIN", "MANAGER"})
public void deleteAllUsers() {
    // ...
}
```
> 'ADMIN' 또는 'MANAGER' 역할을 가진 사용자만 특정 메서드를 호출 가능