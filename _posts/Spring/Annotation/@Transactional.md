---
aliases:
  - "@Transactional"
tags:
  - Spring
  - Annotation
  - spring/Repository
특징:
---
# @Transactional
트랜잭션 공통 관심사 처리

로직이 성공적으로 동작하게 되면 commit 하도록 수행
하지만 테스트에서는 rollback 하도록 처리

[[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 를 사용해서 만들기 때문에 AOP를 알고 있다면 딱히 어려울건 없어보임
[[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Proxy|Proxy]] 만들때 클래스 자체를 만들기 때문에 클래스 단위로 프록시를 만듬

트랜잭션은 애초에 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] 사용하기 때문에 직접적으로 객체를 호출하면 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/Proxy|Proxy]] 거치지 않아서 문제 발생
그렇지만 보통 이렇게 사용하는 경우는 없기 때문에 문제는 없는데
==이런 문제가 일어날 수 있는 방법이 하나는 대상 객체의 내부에서 메서드 호출이 발생하면 프록시를 거치지 않고 대상 객체를 직접 호출하는 문제 발생==
## 규칙
- 우선순위 규칙
 - 클래스에 적용하면 메서드는 자동 적용
### 적용 우선순위
1. 클래스의 메서드(우선순위 가장 높음)
2. 클래스의 타입
3. 인터페이스의 메서드
4. 인터페이스의 타입(우선순위 가장 낮음)
하지만 추천하지 않는 방법 (예전엔 버그가 있었지만 지금은 버그가 없지만 모든게 멀쩡하다는 확신할 수 없다함)
### 예외 발생시 기본 정책
- 언체크 예외인 `RuntimeException`, `Error`와 그 하위 예외가 발생 시 롤백
- 체크 예외인 `Exception`과 그 하위 예외들은 커밋
런타임(언체크) 예외는 복구 불가능한 예외로 가정
체크 예외는 비즈니스 의미가 있을 때 사용

Spring 에서 Exception 처리를 비즈니스 로직(반환용)으로 사용을 허가한다는 것인데 이게 과연 옳을까
그리고 이렇게 쓸 수 있는 경우가 어떤게 있을까?

현재 상태 값이 아닌 메세지만 전달할 경우엔 뭐 이렇게 처리할 수 있다고 치지만
현재 상태 값을 안넘겨주는 경우가 있을까?
## 옵션
### value, transactionManager
`transactionManager` 등록
default 값으로 기본으로 등록된 트랜잭션매니저를 사용
트랜잭션 매니저가 둘 이상이라면 매니저의 이름을 지정해서 구분
```java title:"value/transactionManager 설정"
public class TxService {
	@Transactional("memberTxManager")
	public void member() {...}
	@Transactional(value = "orderTxManager")
	public void order() {...}
}
```
### rollbackFor
기본 정책에 추가로 어떤 예외 발생시 롤백할지 설정

예외 발생시 기본 정책
- 언체크 예외인 `RuntimeException`, `Error`와 그 하위 예외가 발생 시 롤백
- 체크 예외인 `Exception`과 그 하위 예외들은 커밋
`{java icon title:"특정 에러 롤백 지정"}@Transactional(roobackFor = Exception.class)`
### noRollbackFor
rollbackFor 반대 개념
기본 정책에 추가로 어떤 예외가 발생했을 때 롤백하면 안되는지 지정
### propagation (전파)
- 물리 트랜잭션
	실제 데이터베이스에 적용되는 트랜잭션
	실제 커넥션을 통해 트랜잭션을 시작`{java}setAutoCommit(false)`
	실제 커넥션을 통해서 `commit`/`rollback`
- 논리 트랜잭션
	트랜잭션 매니저를 통해 트랜잭션을 사용하는 단위
	트랜잭션이 진행되는 중에 내부에서 추가로 트랜잭션을 사용하는 경우 논리 트랜잭션이 적용

#### REQUIRED (Default)
![[config/AttachedFile/Pasted image 20240605150403.png|600]]
트랜잭션 전파의 기본 옵션 `REQUIRED` 기준으로 설명
- 모든 논리 트랜잭션이 커밋 되어야만 물리 트랜잭션이 커밋
- 하나의 논리 트랜잭션이라도 롤백되면 물리 트랜잭션은 롤백
내부적으로 논리 트랜잭션이 rollback 동작을 하게 되면 `rollbackOnly = true` 상태가 되어 물리 트랜잭션에서는 무조건 롤백을 진행하도록 강제함
```java title:"commit 은 AND 연산 rollback 은 or 연산" hl:18-20
@Test
  void inner_rollback() {
    log.info("외부 트랜잭션 Start");
    TransactionStatus outerStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());
    log.info("outer.isNewTransaction()={}", outerStatus.isNewTransaction()); // true

    log.info("내부 트랜잭션 Start");
    TransactionStatus innerStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());
    log.info("inner.isNewTransaction()={}", innerStatus.isNewTransaction()); // false
    log.info("내부 트랜잭션 rollback Start");
    transactionManager.rollback(innerStatus);
    log.info("내부 트랜잭션 rollback End");

    log.info("내부 트랜잭션 isRollbackOnly={}", innerStatus.isRollbackOnly());
    log.info("외부 트랜잭션 isRollbackOnly={}", outerStatus.isRollbackOnly());

    log.info("외부 트랜잭션 Commit Start");
    Assertions.assertThrows(UnexpectedRollbackException.class, () -> {
      transactionManager.commit(outerStatus);
    });
    log.info("외부 트랜잭션 Commit End");
  }
```
#### REQUIRES_NEW
![[config/AttachedFile/Pasted image 20240605150448.png|600]]
트랜잭션을 분리하는 옵션
> [!hint] 로그 달아야할때 쓰면 좋을 것 같은데
```java title:"PROPAGATION_REQUIRES_NEW 트랜잭션 분리" hl:9
@Test  
void inner_rollback_requires_new()  {  
  log.info("외부 트랜잭션 Start");  
  TransactionStatus outerStatus = transactionManager.getTransaction(new DefaultTransactionDefinition());  
  log.info("outer.isNewTransaction()={}", outerStatus.isNewTransaction()); // true  
  
  log.info("내부 트랜잭션 Start");  
  DefaultTransactionDefinition innerDefinition = new DefaultTransactionDefinition();  
  innerDefinition.setPropagationBehavior(DefaultTransactionDefinition.PROPAGATION_REQUIRES_NEW);  
  TransactionStatus innerStatus = transactionManager.getTransaction(innerDefinition);  
  log.info("inner.isNewTransaction()={}", innerStatus.isNewTransaction()); // true  
  
  log.info("내부 트랜잭션 rollback");  
  transactionManager.rollback(innerStatus);  
  
  log.info("외부 트랜잭션 Commit");  
  transactionManager.commit(outerStatus);  
}
```

#### SUPPORT
기존에 트랜잭션이 있으면 참여하고 없으면 없는대로 진행
거의 사용하지 않음
#### NOT_SUPPORT 
트랜잭션 없이 동작
기존 트랜잭션 있으면 기존 트랜잭션은 보류하고 자기 동작 진행
거의 사용하지 않음
#### MANDATORY
트랜잭션이 반드시 필요
기존 트랜잭션이 없으면 예외 발생`IllegalTransactionStateException`
거의 사용하지 않음
#### NEVER
트랜잭션 사용하지 않음
기존 트랜잭션이 있으면 예외 발생
기존 트랜잭션도 사용하지 않는 강한 부정
거의 사용하지 않음
#### NESTED
기존 트랜잭션 없을 경우 새로운 트랜잭션 생성
기존 트랜잭션 있을 경우 중첩 트랜잭션 생성
중첩 트랜잭션 : 외부 트랜잭션엔 영향을 받지만 중첩 트랜잭션은 외부에 영향을 주지 않음
	중첩 트랜잭션이 롤백 되어도 트랜잭션은 커밋 가능
	외부 트랜잭션이 롤백 되면 중첩 트랜잭션도 함께 롤백
DB 드라이버에서 지원하는 기능인지 확인 필요
JPA 에서 사용 불가능
거의 사용하지 않음
### isolation
트랜잭션 격리 수준 지정
일반적으로 설정하지 않음
==물리적 트랜잭션==일 경우만 적용
- `DEFAULT` : 데이터베이스에서 설정한 격리 수준을 따름
- `READ_UNCOMMITTED` : 커밋되지 않은 읽기
- `READ_COMMITTED` : 커밋된 읽기
- `REPEATABLE_READ` : 반복 가능한 읽기
- `SERIALIZABLE` : 직렬화 가능
### timeout, timeoutString
트랜잭션 수행 시간에 대한 타임아웃을 ==초 단위==로 지정
기본 값은 트랜잭션 시스템의 타임아웃을 사용
운영 환경에 따라 동작하는 경우가 있고 그렇지 않은 경우가 있음
==물리적 트랜잭션==일 경우만 적용
### label
트랜잭션 애노테이션에 있는 값을 직접 읽어서 어떤 동작을 하고 싶을때 사용
일반적으로 사용하지 않음
### readOnly
`readOnly=true` 옵션을 사용하면 등록, 수정, 수정, 삭제가 안되고 읽기 기능만 동작
데이터베이스에 따라 정상 동작하지 않는 경우가 있음
==물리적 트랜잭션==일 경우만 적용
#### 적용되는 곳
- 프레임워크
	- JdbcTemplate 읽기 전용 트랜잭션 안에서 변경 기능을 실행하면 예외를 던짐
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA|JPA]] 읽기 전용 트랜잭션의 경우 커밋 시점에 플러시를 호출하지 않음
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA|JPA]] 기타 등등의 다양한 최적화 발생
- JDBC 드라이버
	- DB 드라이버 버전에 따라 다양하게 동작
	- 읽기 전용 트랜잭션에서 변경 쿼리가 발생 시 예외 발생
	- 읽기, 쓰기(마스터,슬레이브) 데이터베이스를 구분해서 요청 (읽기 전용 트랜잭션의 경우 읽기(슬레이브) 데이터베이스의 커넥션 획득해서 사용)
- 데이터베이스
	- 데이터베이스에 따라 읽기 전용이기 때문에 성능 최적화 발생
## 문제사항
### 객체 메소드 내부에서 메서드 호출 시 발생하는 문제
```java title:"트랜잭션 걸리지 않은 함수에서 걸린 내부 함수를 호출 시 트랜잭션 걸리지 않음" hl:37
@Slf4j
@SpringBootTest
public class InternalCallV1Test {
  @Autowired
  CallService callService;

  @Test
  void checkProxy() {
    log.info("aop class = {}", callService.getClass().getName());
    Assertions.assertTrue(callService != null);
    Assertions.assertTrue(callService instanceof CallService);
  }

  @Test
  void internalCall() {
    callService.internal();
  }

  @Test
  void externalCall() {
    callService.external();
  }

  @TestConfiguration
  static class Config {
    @Bean
    CallService levelService() {
      return new CallService();
    }
  }

  @Slf4j
  static class CallService {
    public void external() {
      log.info("call external");
      printTxInfo();
      internal();
    }

    @Transactional
    public void internal() {
      log.info("call internal");
      printTxInfo();
    }

    private void printTxInfo() {
      // transaction 확성화 되어 있는지 확인
      log.info("transaction Active: {}", TransactionSynchronizationManager.isActualTransactionActive());
    }
  }

}
```
프록시에 감쌓여져있는 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]] `internal()` 호출하는 것이 아닌 자기 자신의 함수를 호출해서 트랜잭션으로 보호되지 않음
이 문제를 해결하기 위한 방법은 `internal()` 함수를 별도의 클래스로 분리하는 방법이 존재
> [!question] 그냥 다 트랜잭션 주면 되는거 아닌가?
> 트랜잭션이 과도하게 걸리게 되면 성능 이슈 발생
### public 메서드만 트랜잭션 적용
`protected`, `private`, `package-visible`에서는 트랜잭션이 적용되지 않음
java를 통해서 안되는 것이 아니라 단순히 Spring 에서 막아둔 것
강제로 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Transactional|@Transactional]] 을 주면 아에 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Transactional|@Transactional]] 을 무시

### 초기화 시점에 적용되지 않을 수 있음
[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@PostConstruct|@PostConstruct]] 의 경우 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP]] 초기화 되지 않은 시점에 동작할 가능성이 있음
```java title:"@PostConstruct 초기화 문제점" hl:24-35
@Slf4j
@SpringBootTest
public class InitTxTest {

  @Autowired
  InitTest initTest;

  @Test
  void init() {
    log.info("init");
  }


  @TestConfiguration
  static class Config {
    @Bean
    InitTest hello() {
      return new InitTest();
    }
  }

  @Slf4j
  static class InitTest {
    @PostConstruct
    @Transactional
    public void initV1() {
      log.info("initV1");
      printTxInfo();
    }
    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void initV2() {
      log.info("initV2");
      printTxInfo();
    }
    private void printTxInfo() {
      // transaction 확성화 되어 있는지 확인
      log.info("transaction Active: {}", TransactionSynchronizationManager.isActualTransactionActive());
    }
  }
}
```

## 많이 실수하는 부분
![[config/AttachedFile/Pasted image 20240607164744.png|600]]
해당 부분에서 에러를 `MemeberService`에서 `try/catch` 처리하면 될줄 알지만 `rollbackOnly` 가 이미 `true` 로 설정되어서 모두 롤백이 발생
 이런 상황에는 예상하지 못한 롤백 발생 에러`UnexpectedRollbackException`를 반환 
이런 경우에 `LogRepository` 에서는 [[#REQUIRES_NEW]] 를 사용하면 트랜잭션을 새로 생성하기 때문에 문제를 해결 가능