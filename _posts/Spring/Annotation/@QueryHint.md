---
aliases:
  - "@QueryHint"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @QueryHint
- JPA 구현체에게 제공하는 힌트
- [[하이버네이트]] 는 좀 더 많은 기능을 가지고 있는데 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Spring Data JPA|Spring Data JPA]] 는 [[하이버네이트]] 만큼 기능이 부족하기에 그걸 사용할 수 있도록 하기 위해 임시방편적인 있다면 동작하라는 의미로 힌트 기능 제공
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@QueryHints|@QueryHints]] 사용하여 그룹으로 묶어서 사용 가능
## 🚨 주의사항
- 이걸 쓸만큼 효과가 뛰어나다 할 수 없음
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java
  @QueryHints(value = @QueryHint(name = "org.hibernate.readOnly", value = "true"))
  Member findReadOnlyByUsername(String username);
```