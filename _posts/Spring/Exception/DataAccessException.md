---
aliases:
  - DataAccessException
tags:
  - Spring
  - Spring/Exception
  - Spring/공통처리
특징: 
---
# DataAccessException
Spring에서 DB 연결 관련으로 제공하는 Exception 
`스프링 데이터 접근 예외` 에러로 DB 사용에 있어서 모든 에러를 공통으로 처리
![[config/AttachedFile/Pasted image 20240527155258.png|600]]
- NonTransient : 일시적이지 않음 같은 SQL 반복시 실패
- Transient : 일시적인 에러, 동일한 SQL 시도할 경우 성공할 가능성이 있음
## [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA|JPA]] Exception 처리
Spring 은 `PersistenceExceptionTranslator` 를 통해서 JPA 를 Spring 공통 에러로 변환
`PersistenceExceptionTranslator` 등록은 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Repository|@Repository]] 등록 시 자동으로 [[2.Ref(데이터 및 정보 저장)/Spring/공통관심사/AOP|AOP]]를 이용해서 변환
`EntityManagerFactoryUtils.convertJpaAccessExceptionIfPossible()` 함수를 이용해서 실질적인 전환
## SQLException
```java title:"error code 를 보고 직접 에러를 처리" hl:9
@Test  
void sqlExceptionErrorCode() {  
  String sql = "select bad grammer";  
  
  try (var connection = dataSource.getConnection();  
       var preparedStatement = connection.prepareStatement(sql)) {  
    preparedStatement.executeQuery();  
  } catch (SQLException e) {  
    Assertions.assertEquals(42122, e.getErrorCode());  
    log.info("e.getErrorCode() = " + e.getErrorCode());  
  }  
}
```
기존에는 ErrorCode 를 보고 직접 Exception 을 찾아줬어야함

```java title:"spring 에러 변환기를 이용해서 어떤 DB든 통일적으로 Exception 사용" hl:11-12
@Test  
void sqlSpringExceptionErrorCode() {  
  String sql = "select bad grammer";  
  
  try (var connection = dataSource.getConnection();  
       var preparedStatement = connection.prepareStatement(sql)) {  
    preparedStatement.executeQuery();  
  } catch (SQLException e) {  
    Assertions.assertEquals(42122, e.getErrorCode());  
    log.info("e.getErrorCode() = " + e.getErrorCode());  
    SQLErrorCodeSQLExceptionTranslator exceptionTranslator = new SQLErrorCodeSQLExceptionTranslator(dataSource);  
    DataAccessException dataAccessException = exceptionTranslator.translate("select", sql, e);  
    log.info("dataAccessException = " + dataAccessException);  
    // dataAccessException -> BadSqlGrammarException 인지 확인  
    Assertions.assertTrue(dataAccessException instanceof BadSqlGrammarException);  
  }  
}
```

`{java}exceptionTranslator.translate(추가될설명-보통함수명작성, sql, 발생한SQLException);`

Spring 은 어떻게 ErrorCode 별로 Exception을 분배할 수 있는지 확인하려면 `org.springframework.jdbc.support.sql-error-codes.xml` 통해서 미리 분배 준비가 되어 있음