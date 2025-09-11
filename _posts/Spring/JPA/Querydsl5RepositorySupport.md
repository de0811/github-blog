---
aliases:
  - Querydsl5RepositorySupport
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: QuerydslRepositorySupport 가 예전 queryDSL 3 버전 지원 상태이기 때문에 직접 5버전 지원으로 커스텀한 클래스
---
# Querydsl5RepositorySupport
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/QuerydslRepositorySupport|QuerydslRepositorySupport]] 단점 및 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Sort|Sort]] 버그로 직접 작성
## ⚙️ 설정
## 🚨 주의사항
- 일단 [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 5 버전에 대해 기준으로 작성
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
- QuerydslRepositorySupport 와 유사하게 작성한 아래 코드
```java title:"queryDSL 버전에 맞게 커스텀(이 코드 말고 밑에 코드를 실사용)"
package study.querydsl.repository.support;

import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.Querydsl;
import org.springframework.data.querydsl.SimpleEntityPathResolver;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.util.List;
import java.util.function.Function;

/**
 * Querydsl 5.x 버전에 맞춘 Querydsl 지원 라이브러리
 *
 * @author DongMin Seo
 * @see org.springframework.data.jpa.repository.support.QuerydslRepositorySupport
 */
@Repository
public abstract class Querydsl5RepositorySupport {
  private final Class domainClass;
  private Querydsl querydsl;
  private EntityManager entityManager;
  private JPAQueryFactory queryFactory;

  public Querydsl5RepositorySupport(Class<?> domainClass) {
    Assert.notNull(domainClass, "Domain class must not be null!");
    this.domainClass = domainClass;
  }

  @Autowired
  public void setEntityManager(EntityManager entityManager) {
    Assert.notNull(entityManager, "EntityManager must not be null!");
    // EntityPath 제대로 설정해야 Sort 정상 동작
    JpaEntityInformation entityInformation = JpaEntityInformationSupport.getEntityInformation(domainClass, entityManager);
    SimpleEntityPathResolver resolver = SimpleEntityPathResolver.INSTANCE;
    EntityPath path = resolver.createPath(entityInformation.getJavaType());
    this.entityManager = entityManager;
    this.querydsl = new Querydsl(entityManager, new PathBuilder<>(path.getType(), path.getMetadata()));
    this.queryFactory = new JPAQueryFactory(entityManager);
  }

  @PostConstruct
  public void validate() {
    Assert.notNull(entityManager, "EntityManager must not be null!");
    Assert.notNull(querydsl, "Querydsl must not be null!");
    Assert.notNull(queryFactory, "QueryFactory must not be null!");
  }

  protected JPAQueryFactory getQueryFactory() {
    return queryFactory;
  }

  protected Querydsl getQuerydsl() {
    return querydsl;
  }

  protected EntityManager getEntityManager() {
    return entityManager;
  }

  protected <T> JPAQuery<T> select(Expression<T> expr) {
    return getQueryFactory().select(expr);
  }

  protected <T> JPAQuery<T> selectFrom(EntityPath<T> from) {
    return getQueryFactory().selectFrom(from);
  }

  // QueryDSL 4.x 버전에서만 가능
//  protected <T> Page<T> applyPagination(
//    Pageable pageable,
//    Function<JPAQueryFactory, JPAQuery> contentQuery
//  ) {
//    JPAQuery jpaQuery = contentQuery.apply(getQueryFactory());
//    List<T> content = getQuerydsl().applyPagination(pageable, jpaQuery).fetch();
//    return PageableExecutionUtils.getPage(content, pageable, jpaQuery::fetchCount);
//  }

//  protected <T> Page<T> applyPagination(
//    Pageable pageable,
//    Function<JPAQueryFactory, JPAQuery> contentQuery,
//    Function<JPAQueryFactory, JPAQuery> countQuery
//  ) {
//    JPAQuery jpaContentQuery = contentQuery.apply(getQueryFactory());
//    List content = getQuerydsl().applyPagination(pageable, jpaContentQuery).fetch();
//    JPAQuery countResult = countQuery.apply(getQueryFactory());
//    return PageableExecutionUtils.getPage(content, pageable, countResult::fetchCount);
//  }

  protected <T> Page<T> applyPagination(
    Pageable pageable,
    Function<JPAQueryFactory, JPAQuery> contentQuery,
    Function<JPAQueryFactory, Long> countQuery
  ) {
    JPAQuery jpaContentQuery = contentQuery.apply(getQueryFactory());
    List content = getQuerydsl().applyPagination(pageable, jpaContentQuery).fetch();
    return PageableExecutionUtils.getPage(content, pageable, () -> countQuery.apply(getQueryFactory()));

  }


}
```

- 실 사용에 맞게 변경한 아래 코드
```java title:"다중 DB 처리용"
package net.nshc.xs.installer.xspConsole.console.db;


import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.Querydsl;
import org.springframework.data.querydsl.SimpleEntityPathResolver;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import org.springframework.util.Assert;

import java.util.List;
import java.util.function.Function;

/**
 * Querydsl 5.x 버전에 맞춘 Querydsl 지원 라이브러리
 *
 * @author DongMin Seo
 * @see org.springframework.data.jpa.repository.support.QuerydslRepositorySupport
 */
@Repository
public abstract class Querydsl5RepositorySupport {
  private final Class domainClass;
  private final Querydsl querydsl;
  private final EntityManager entityManager;
  private final JPAQueryFactory queryFactory;

  public Querydsl5RepositorySupport(Class<?> domainClass, EntityManager entityManager) {
    Assert.notNull(domainClass, "Domain class must not be null!");
    this.domainClass = domainClass;

    Assert.notNull(entityManager, "EntityManager must not be null!");
    // EntityPath 제대로 설정해야 Sort 정상 동작
    JpaEntityInformation entityInformation = JpaEntityInformationSupport.getEntityInformation(domainClass, entityManager);
    SimpleEntityPathResolver resolver = SimpleEntityPathResolver.INSTANCE;
    EntityPath path = resolver.createPath(entityInformation.getJavaType());
    this.entityManager = entityManager;
    this.querydsl = new Querydsl(entityManager, new PathBuilder<>(path.getType(), path.getMetadata()));
    this.queryFactory = new JPAQueryFactory(entityManager);
  }

  protected JPAQueryFactory getQueryFactory() {
    return queryFactory;
  }

  protected Querydsl getQuerydsl() {
    return querydsl;
  }

  protected EntityManager getEntityManager() {
    return entityManager;
  }

  protected <T> JPAQuery<T> select(Expression<T> expr) {
    return getQueryFactory().select(expr);
  }

  protected <T> JPAQuery<T> selectFrom(EntityPath<T> from) {
    return getQueryFactory().selectFrom(from);
  }

  // QueryDSL 4.x 버전에서만 가능
//  protected <T> Page<T> applyPagination(
//    Pageable pageable,
//    Function<JPAQueryFactory, JPAQuery> contentQuery
//  ) {
//    JPAQuery jpaQuery = contentQuery.apply(getQueryFactory());
//    List<T> content = getQuerydsl().applyPagination(pageable, jpaQuery).fetch();
//    return PageableExecutionUtils.getPage(content, pageable, jpaQuery::fetchCount);
//  }

//  protected <T> Page<T> applyPagination(
//    Pageable pageable,
//    Function<JPAQueryFactory, JPAQuery> contentQuery,
//    Function<JPAQueryFactory, JPAQuery> countQuery
//  ) {
//    JPAQuery jpaContentQuery = contentQuery.apply(getQueryFactory());
//    List content = getQuerydsl().applyPagination(pageable, jpaContentQuery).fetch();
//    JPAQuery countResult = countQuery.apply(getQueryFactory());
//    return PageableExecutionUtils.getPage(content, pageable, countResult::fetchCount);
//  }

  protected <T> Page<T> applyPagination(
    Pageable pageable,
    Function<JPAQueryFactory, JPAQuery> contentQuery,
    Function<JPAQueryFactory, Long> countQuery
  ) {
    JPAQuery jpaContentQuery = contentQuery.apply(getQueryFactory());
    List content = getQuerydsl().applyPagination(pageable, jpaContentQuery).fetch();
    return PageableExecutionUtils.getPage(content, pageable, () -> countQuery.apply(getQueryFactory()));

  }


}

```