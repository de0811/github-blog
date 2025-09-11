---
aliases:
  - "@PostFilter"
tags:
  - Spring
  - Spring/Security
  - Annotation
  - Annotation/Security
특징: 
---
# @PostFilter
메소드 호출 후에 보안 표현식을 평가하여 접근을 허용할지 결정(조건에 맞지 않는 값은 걸러서 전송)

반환되는 컬랙션 또는 배열 유형의 입력 변수를 필터링 하는데 사용
[[SpEL (Spring Expression Language)]] 표현식 사용

인증되지 않는 용자가 호출하게 되면  `AuthenticationCredentialsNotFoundException` 에러 발생
권한이 없는 사용자가 호출하게 되면 `AccessDeniedException` 에러 발생

```java
@PostFilter("filterObject.owner == authentication.name")
public List<Account> getAccounts() {
    // ...
}
```
> 반환되는 배열의 각 값들의 owner의 값이 현재 인증된 사용자의 이름과 같은지 확인

