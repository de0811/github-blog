---
aliases:
  - PersistenceUnitUtil
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# PersistenceUnitUtil
- 프록시 관련 유틸리티
## 🚨 주의사항
## 🔍 속성 설명
```java
public interface PersistenceUnitUtil extends PersistenceUtil {
    public boolean isLoaded(Object entity, String attributeName);
    public boolean isLoaded(Object entity);
    public Object getIdentifier(Object entity);
} 
```
- `isLoaded(Object entity, String attributeName)`: 주어진 엔티티의 특정 속성이 로드되었는지 여부를 확인  
- `isLoaded(Object entity)`: 주어진 엔티티가 로드되었는지 여부를 확인, [[2.Ref(데이터 및 정보 저장)/Spring/JPA/FetchType|FetchType.EAGER]] 로 지정된 모든 속성이 로드된 경우 엔티티는 로드된 것으로 간주  
- `getIdentifier(Object entity)`: 엔티티의 식별자를 반환, 데이터베이스 삽입이 발생한 후에만 생성된 식별자가 보장, 엔티티에 식별자가 없는 경우 null을 반환
### 📌
## 🛠 사용 예제