---
aliases:
  - "@PreAuthorize"
tags:
  - Annotation
  - Spring/Security
  - Spring
특징: 
---
# @PreAuthorize
__메서드 접근에 대한 검증__
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ EnableMethodSecurity|@EnableGlobalMethodSecurity(prePostEnabled = true)]] 설정이 활성화된 경우에만 사용
보안 관련 조건을 정의하며 이 조건이 ==참일 경우==에만 메서드 실행
@PreAuthorize 어노테이션의 인자로는 [[SpEL (Spring Expression Language)]] 표현식 사용

인증되지 않는 용자가 호출하게 되면  `AuthenticationCredentialsNotFoundException` 에러 발생
권한이 없는 사용자가 호출하게 되면 `AccessDeniedException` 에러 발생

```java
@PreAuthorize("hasRole('ADMIN')")
public void deleteAllUsers() {
    // ...
}
```
> 단순 사용 방법

`deleteAllUsers()` 함수는 `@PreAuthorize` [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|애노테이션(annotation)]] 으로 보호
`ADMIN` 역활을 가진 사용자만 사용 가능

```java
@PreAuthorize("hasRole('ADMIN') or (hasRole('USER') and #user.name == 'john')")
public void deleteUser(User user) {
    // ...
}
```
> 복합 사용 방법
>`'ADMIN'` 역할을 가지거나, `'USER'` 역할을 가지면서 사용자 이름이 `'john'`인 경우에만 호출 가능


```java
@PreAuthorize("hasAuthority('VIEWLOANS')")
@PreAuthorize("hasRole('ADMIN')")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@PreAuthorize("#username==authentication.principal.username")
public Loan getLoanDetails(String username) {
	return loansRepository.loadLoanDetailsByUserName(username);
}
```

```java
@GetMapping("/api/users/me")
@PreAuthorize("isAuthenticated()")
public UserResponse getMe(@AuthenticationPrincipal ExternalUser extUser) {
    return userService.getMe(extUser.getId());
}
```