---
aliases:
  - "@BatchSize"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 쿼리가 테이블의 수만큼 한번에 [[SQL]] 요청 가능
---
# @BatchSize
- N+1 [[SQL]] 발생 문제를 해결하는데 도움
- 쿼리가 테이블의 수만큼 한번에 [[SQL]] 요청 가능 
- 찾아야하는 부모 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] `id` 값을 미리 한번에 몇개를 불러올지 설정
- 글로벌 속성으로 지정 가능
	- `{xml icon}<property name="hibernate.default_batch_fetch_size" value="100"/>`
	- `{properties icon title:"application.properties"}spring.jpa.properties.hibernate.default_batch_fetch_size=100`
## 🚨 주의사항
- 보통 100~1000 사이로 설정
	-  1000 이상 설정시 문제 발생하는 DB 존재
## 🔍 속성 설명
```java
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface BatchSize {
  int size();
}
```
> `size` : 한번에 로딩할 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 개수 설정 
### 📌
## 🛠 사용 예제