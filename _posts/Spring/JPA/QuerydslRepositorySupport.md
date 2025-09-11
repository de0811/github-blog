---
aliases:
  - QuerydslRepositorySupport
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# QuerydslRepositorySupport
- [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 의 페이징이 좀 더 쉽게 동작
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Sort|Sort]] 오류 발생할 수 있음
## ⚙️ 설정
## 🚨 주의사항
- from 부터 먼저 시작되고 select 함수가 마지막에 동작
- [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 3.x 버전을 대상으로 만들어짐
- 해당 문제로 인해 지원 클래스를 직접 만드는 것을 추천
## 🔍 속성 설명
```java
@Repository
public abstract class QuerydslRepositorySupport {
  private final PathBuilder<?> builder;
  @Nullable
  private EntityManager entityManager;
  @Nullable
  private Querydsl querydsl;

  public QuerydslRepositorySupport(Class<?> domainClass) {
    Assert.notNull(domainClass, "Domain class must not be null");
    this.builder = (new PathBuilderFactory()).create(domainClass);
  }
  @Autowired
  public void setEntityManager(EntityManager entityManager) {
    Assert.notNull(entityManager, "EntityManager must not be null");
    this.querydsl = new Querydsl(entityManager, this.builder);
    this.entityManager = entityManager;
  }
  @PostConstruct
  public void validate() {
    Assert.notNull(this.entityManager, "EntityManager must not be null");
    Assert.notNull(this.querydsl, "Querydsl must not be null");
  }
  @Nullable
  protected EntityManager getEntityManager() {
    return this.entityManager;
  }
  protected JPQLQuery<Object> from(EntityPath<?>... paths) {
    return this.getRequiredQuerydsl().createQuery(paths);
  }
  protected <T> JPQLQuery<T> from(EntityPath<T> path) {
    return this.getRequiredQuerydsl().createQuery(new EntityPath[]{path}).select(path);
  }
  protected DeleteClause<JPADeleteClause> delete(EntityPath<?> path) {
    return new JPADeleteClause(this.getRequiredEntityManager(), path);
  }
  protected UpdateClause<JPAUpdateClause> update(EntityPath<?> path) {
    return new JPAUpdateClause(this.getRequiredEntityManager(), path);
  }
  protected <T> PathBuilder<T> getBuilder() {
    return this.builder;
  }
  @Nullable
  protected Querydsl getQuerydsl() {
    return this.querydsl;
  }
  private Querydsl getRequiredQuerydsl() {
    if (this.querydsl == null) {
      throw new IllegalStateException("Querydsl is null");
    } else {
      return this.querydsl;
    }
  }
  private EntityManager getRequiredEntityManager() {
    if (this.entityManager == null) {
      throw new IllegalStateException("EntityManager is null");
    } else {
      return this.entityManager;
    }
  }
}
```
### 📌
## 🛠 사용 예제