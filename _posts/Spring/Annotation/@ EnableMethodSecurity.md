---
aliases:
  - "@EnableGlobalMethodSecurity"
  - "@EnableMethodSecurity"
tags:
  - Spring
  - Spring/Security
  - Annotation
특징: 
---
# @EnableGlobalMethodSecurity / @EnableMethodSecurity
메서드 수준의 보안 활성화
쉽게 말해 메서드를 사용하는데 권한을 확인해서 사용할 수 있도록 하는 어노테이션을 사용하겠다고 설정하는 어노테이션

`@EnableGlobalMethodSecurity`는 Spring Security에서 메서드 수준의 보안을 활성화하는 어노테이션입니다. 이 어노테이션을 사용하면 특정 메서드에 대한 접근을 제한하거나, 특정 권한을 가진 사용자만이 메서드를 호출할 수 있도록 설정할 수 있습니다.



이 어노테이션의 속성
- `prePostEnabled`
	- `@EnableGlobalMethodSecurity(prePostEnabled = true)` 
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PreAuthorize|@PreAuthorize]] 및 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PostAuthorize|@PostAuthorize]] 어노테이션을 활성화
	- 보안 표현식 사용 가능
- `securedEnabled`
	- `@EnableMethodSecurity(securedEnabled = true)`
	- `@EnableGlobalMethodSecurity(securedEnabled = true)` 해당 방법은 deprecated
	- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Secured|@Secured]] 어노테이션을 활성화
	- 메서드에 접근하는 권한 지정
- `jsr250Enabled`
	- `@EnableGlobalMethodSecurity(jsr250Enabled = true)`
	- JSR-250 어노테이션([[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RolesAllowed|@RolesAllowed]])을 활성화
	- 메서드에 접근할 수 있는 역할을 지정
- `mode`
	- `@EnableMethodSecurity(mode = AdviceMode.ASPECTJ, securedEnabled = true, prePostEnabled = false)`
	- `AdviceMode.ASPECTJ` 와 `AdviceMode.PROXY` 설정 가능
	- `AdviceMode.ASPECTJ` 설정할 경우 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 사용 가능
## `@EnableMethodSecurity(prePostEnabled = true)`
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PreAuthorize|@PreAuthorize]] 및 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PostAuthorize|@PostAuthorize]] 어노테이션을 활성화(배열 아닌 처리)
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PreFilter|@PreFilter]] 및 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PostFilter|@PostFilter]] 어노테이션 활성화(배열 처리)
가장 추천하는 방식이라 함
## `@EnableMethodSecurity(securedEnabled = true)`
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Secured|@Secured]] 어노테이션을 활성화
## `@EnableMethodSecurity(jsr250Enabled = true)`
JSR-250 어노테이션([[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@RolesAllowed|@RolesAllowed]])을 활성화

