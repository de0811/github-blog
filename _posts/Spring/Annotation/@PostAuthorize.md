---
aliases:
  - "@PostAuthorize"
tags:
  - Spring/Security
  - Annotation
  - Spring
특징: 
---
# @PostAuthorize
__반환 값에 대한 검증__
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@ EnableMethodSecurity|@EnableGlobalMethodSecurity(prePostEnabled = true)]] 설정이 활성화된 경우에만 사용

@PostAuthorize 어노테이션의 인자로는 [[SpEL (Spring Expression Language)]] 표현식 사용

인증되지 않는 용자가 호출하게 되면  `AuthenticationCredentialsNotFoundException` 에러 발생
권한이 없는 사용자가 호출하게 되면 `AccessDeniedException` 에러 발생

```java
@PostAuthorize("returnObject.owner.name == authentication.name")
public Document getDocument(Long id) {
    // ...
}
```
>메서드가 반환하는 객체의 소유자가 현재 사용자와 일치하는 경우에만 결과를 반환
> `getDocument(Long id)` 메서드는 `@PostAuthorize` 어노테이션에 의해 보호
 메서드가 반환하는 `Document` 객체의 `owner`의 `name`이 현재 인증된 사용자의 이름과 일치하는 경우에만 `Document` 객체를 반환

```java
@PostAuthorize("returnObject.username == authentication.principal.username")
@PostAuthorize("hasPermission(returnObject,'ADMIN')")
public Loan getLoanDetails(String username) {
	return loanRepository.loadLoanByUserName(username);
}
```


## hasPermission 의 사용
PermissionEvaluator 인터페이스를 상속받아 정의하여 사용
해당 인터페이스는 사용자의 권한을 더 세밀하게 제어하기 위해 사용
```java
public interface PermissionEvaluator extends AopInfrastructureBean {

	/*
	authentication : 주어진 사용자가
	targetDomainObject : 특정 도메인 객체에
	permission : 특정 권한을 가지고 있는지 확인

	targetDomainObject == null 일 경우 구현체는 false 를 반환해야함
	*/
	boolean hasPermission(Authentication authentication, Object targetDomainObject, Object permission);

	/*
	대상 객체의 인스턴스 대신 대상 객체의 식별자만 사용할 수 있는 권한 평가의 대안 메소드
	여기서 targetId는 객체 인스턴스의 식별자(보통 Long), targetType은 대상의 타입(보통 Java 클래스 이름)을 나타냄
	*/
	boolean hasPermission(Authentication authentication, Serializable targetId, String targetType, Object permission);


```