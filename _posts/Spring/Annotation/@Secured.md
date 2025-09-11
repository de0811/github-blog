---
aliases:
  - "@Secured"
tags:
  - Spring
  - Spring/Security
  - Annotation
특징: 권한 목록 중 포함되어 있으면 메서드 호출 가능하도록 보호
---
# @Secured
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ EnableMethodSecurity|@EnableGlobalMethodSecurity(securedEnabled = true)]] 설정이 활성화된 경우에만 사용 가능
권한 목록을 지정 가능
권한 목록 중 하나 이상을 가진 사용자만 해당 메서드를 호출 할 수 있음

인증되지 않는 용자가 호출하게 되면  `AuthenticationCredentialsNotFoundException` 에러 발생
권한이 없는 사용자가 호출하게 되면 `AccessDeniedException` 에러 발생

[[SpEL (Spring Expression Language)]] 표현식 사용하지 않음

```java
@Secured("ROLE_ADMIN")
public void deleteAllUsers() {
    // ...
}
```
>`'ROLE_ADMIN'` 권한을 가진 사용자만이 이 메서드를 호출 가능

 `deleteAllUsers()` 메서드는 `@Secured` 어노테이션에 의해 보호
 

```java
@Secured({"ROLE_ADMIN", "ROLE_MANAGER"})
public void deleteAllUsers() {
    // ...
}
```
> `'ROLE_ADMIN'` 또는 `'ROLE_MANAGER'` 권한을 가진 사용자만 특정 메서드를 호출 가능
