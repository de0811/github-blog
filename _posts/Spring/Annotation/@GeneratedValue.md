---
aliases:
  - "@GeneratedValue"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @GeneratedValue
- 키 자동 생성 방법
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Id|@Id]]와 유사한 사용
## 🚨 주의사항
## 🔍 속성 설명
```java title:"GenerationType과 함께 사용"
@Target({ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface GeneratedValue {
  GenerationType strategy() default GenerationType.AUTO;
  String generator() default "";
}
```

```java title:"키 생성 방법 설정 타입"
public enum GenerationType {  
  TABLE,  
  SEQUENCE,  
  IDENTITY,  // DB 에서 값을 넣어줌
  AUTO;  
  
  private GenerationType() {}
}
```
> `IDENTITY` : 데이터베이스에 위임, 보통 `MYSQL`에서 사용 가능
> `SEQUENCE` : 데이터베이스 시퀀스 오브젝트 사용,  보통`ORACLE`에서 사용 가능
> 	[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@SequenceGenerator]] 필요
> `TABLE` : 키 생성용 테이블 사용, **모든 DB에서 사용 가능**, **성능 문제**
> 	[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@TableGenerator]] 필요
> `AUTO` : 방언에 따라 자동 지정, 기본값
### 📌 `IDENTITY` 전략
- `DB`에 값이 입력 되어야 `ID` 값을 알 수 있음
- 하지만 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]] 에서 관리되기 위해서는 `ID` 값을 알고 있어야함
- `commit` 하기도 전에 먼저 `insert`를 `commit` 해서 ID 값을 가져와서 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]] 에서 관리
- [[2.Ref(데이터 및 정보 저장)/Docker/🌿mysql|mysql]] , [[2.Ref(데이터 및 정보 저장)/Docker/postgresql|postgresql]] , [[SQL Server]], [[DB2]] 에서 사용
## 🛠 사용 예제
```java
@Entity
public class Board {
  @Id // primary key
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id; // 게시글 번호
}
```
