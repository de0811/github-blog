---
aliases:
  - "@PreFilter"
tags:
  - Spring
  - Spring/Security
  - Annotation
  - Annotation/Security
특징: 메소드 보안 인자 값이 배열, 컬렉션일때 사용
---
# @PreFilter
메소드 호출 전에 컬랙션 또는 배열 유형의 입력 변수를 필터링 하는데 사용 (조건에 맞지 않는 것은 걸러서 받아들임)
메소드의 입력되는 인수에 적용
[[SpEL (Spring Expression Language)]] 표현식 사용

인증되지 않는 용자가 호출하게 되면  `AuthenticationCredentialsNotFoundException` 에러 발생
권한이 없는 사용자가 호출하게 되면 `AccessDeniedException` 에러 발생

```java
@PreFilter(filterTarget="accounts", value="filterObject.owner == authentication.name")  
public void deleteAccounts(List<Account> accounts) {  
    // ...  
}
```
> 사용자가 소유한 객체만 처리하도록 컬랙션을 필터링하는 방법

`filterTarget` : [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]] 이름을 나타냄
`value` : 적용할 보안 표현식

```java
@PreFilter("filterObject.contactName != 'Test'")
public String saveContactInquiryDetails(@RequestBody List<Contact> contacts) {
	// business logic
	return result;
}
```
> 인자로 받은 인수의 값을 확인

