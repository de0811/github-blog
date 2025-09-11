---
aliases:
  - AspectJ
tags:
  - Java
특징: 
---
# AspectJ
PARC에서 개발한 자바 프로그래밍 언어용 관점 지향 프로그래밍(AOP) 확장 기능

![[config/AttachedFile/Pasted image 20240229144810.png]]

![[config/AttachedFile/Pasted image 20240229144825.png]]

![[config/AttachedFile/Pasted image 20240229151043.png]]

[^Aspect]: 여러 객체에 공통으로 적용되는 기능을 분리하여 작성한 클래스
[^JoinPoint]: 객체(인스턴스) 생성 지점, 메소드 호출 시점, 예외 발생 시점 등 특정 작업이 시작되는 시점
[^Advice]: JoinPoint에 삽입되어 동작될 코드, 메소드
[^Before_Advice]: JoinPoint 앞에서 실행
[^Around_Advice]: JoinPoint 앞과 뒤에서 실행
[^After_Advice]: JoinPoint 호출이 리턴되기 직전에 실행
[^After_Returning_Advice]: JoinPoint 메소드 호출이 정상적으로 종료된 후 실행
[^After_ThrowingAdvice]: 예외가 발생했을 때 실행
[^Pointcut]: JoinPoint 부분 집합 / 실제 Advice 가 적용되는 부분
[^Introducion]: 정적인 방식의 AOP 기술
[^Weaving]: 작성한 Advice (공통 코드)를 핵심 로직 코드에 삽입


- 자바 프로그래밍에 대한 완벽한 관점 지향 확장
- 횡단 관심자의 깔끔한 모듈화
	- 오류 검사 및 처리
	- 동기화
	- 성능 최적화(캐싱)
	- 모니터링 및 로깅
AOP를 사용할 때 부가 기능 로직을 실제 로직에 추가할 수 있는 방법 3가지
- 위빙(Weaving) : 컴파일 시점 ([[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AspectJ|AspectJ]] 프레임 워크 사용 시 사용 가능)
	- `.java`파일을 AspectJ 컴파일러를 이용해서 `.class` 만드는 시점에 부가 기능 추가 가능
	- 단점 : 특별한 컴파일러 필요와 복잡성
- 로드타임 위빙 : 클래스 로딩 시점([[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AspectJ|AspectJ]] 프레임 워크 사용 시 사용 가능)
	- `.class` 파일을 JVM 에 올리기 직전에 추가하여 저장
	- `java instrumentation` 기술 사용
	- 단점 : 특별한 옵션을 통해서 클래스 로더 조작기를 지정 필요, 번거롭고 복잡
- 런타임 시점(프록시)
	- 단점 : @Override 되는 것만 적용 가능

Join Point(조인 포인트) : AOP를 어디다가 적용을 시킬지 설정(생성자, 필드 값 접근, static 메서드 접근, 메서드 실행 등)
	하지만 Spring AOP인 ==프록시 방식==의 경우 메서드 실행 지점에만 적용 가능