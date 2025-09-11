---
aliases:
  - "@Lob"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 어느 정도의 크기를 가지는지 알 수 없는 데이터일 경우 사용
---
# @Lob
- 어느 정도의 크기를 가지는지 알 수 없는 데이터일 경우 사용
> [!warning] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Lob|@Lob]] 사용시 DB 호환성 에러 발생
> [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Lob|@Lob]] 사용할 때  [[2.Ref(데이터 및 정보 저장)/Docker/postgresql|postgresql]] 등의 DB에서 호환성 에러 발생
> Spring 3.x 이상부터 호환성 에러 발생
> [[@Column]]`(columnDefinition = "TEXT")` 사용하여 대체 가능
## 🚨 주의사항
## 🔍 속성 설명
### 📌
## 🛠 사용 예제

https://limvik.github.io/posts/mysql-set-text-type-in-jpa-not-using-column-columndefinition-text/


@Lob  
@Column(length = 65535)
✅ **장점**:
• MySQL, PostgreSQL, Oracle 등 여러 DB에서 자동으로 적절한 타입으로 변환됨.
• JPA 표준 방식이므로 호환성이 좋음.
❌ **단점**:
• 일부 DB에서는 적절한 매핑이 안 될 수도 있음. 그게 postgreSQL 이더라 시벌
방법은 Oracle, MYSQL 은 해결 되는데
PostgreSQL 에서는 oid(주소값 저장)으로 저장되고 다른데로 저장되어버림

**Hibernate Dialect를 활용하여 동적으로 설정** 방법
✅ **장점**:
• DB별로 자동으로 타입을 맞춰줄 수 있음.
• 코드에서 @Column(columnDefinition = "...")을 직접 지정할 필요 없음.
❌ **단점**:
• Hibernate Dialect를 관리해야 하므로 복잡성이 증가함.
https://rudaks.tistory.com/entry/spring-data-jpa%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%A0-%EB%95%8C-postgresql%EC%9D%98-Lob%ED%83%80%EC%9E%85-%EB%AC%B8%EC%A0%9C 


 **Enum + @Column(columnDefinition = "...")을 사용해 동적 처리**
 Spring에서 **DB별로 다른 columnDefinition을 적용하는 방법**으로 @Enumerated와 Enum을 활용할 수도 있습니다.
**예제: DB 타입별 설정**
```java
public enum DatabaseType {
    MYSQL("TEXT"),
    POSTGRESQL("TEXT"),
    ORACLE("CLOB"),
    SQLSERVER("NVARCHAR(MAX)");

    private final String columnDefinition;

    DatabaseType(String columnDefinition) {
        this.columnDefinition = columnDefinition;
    }

    public String getColumnDefinition() {
        return columnDefinition;
    }
}
```

```java
@Entity
public class MyEntity {

    @Lob
    @Column(columnDefinition = DatabaseConfig.getColumnDefinition())
    private String textData;

}
```
✅ **장점**:
• 다이얼렉트 관리 없이도 DB별 맞춤 적용 가능.
• 유지보수성이 비교적 좋음.
❌ **단점**:
• 초기 설정이 다소 번거로움.
• DB 연결 전에 정확한 DB 타입을 감지해야 함.


결국
https://stackoverflow.com/questions/75042081/hibernate-6-postgres-and-bytea
이걸 보고 해결함

## Boolean 저장 차이
mysql 은 TINYINT(1) 로 저장
mysql 에서는 boolean 타입은 5버전대부터 지원 이전에는 BIT(1) 사용
postgresql 은 boolean 로 저장
oracle 은 NUMBER(1) 로 저장
oracle 에서는 boolean 타입 없음
SQL Server 에서는 BIT 사용

enum 으로 해버리기도 함


