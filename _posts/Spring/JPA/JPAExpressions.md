---
aliases:
  - JPAExpressions
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# JPAExpressions
- 서브 쿼리 사용 하기 위해 사용
## ⚙️ 설정
## 🚨 주의사항
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA|JPA]] 서브 쿼리는 from 절의 서브쿼리(인라인 뷰)는 지원하지 않음
	- 서브쿼리를 join 으로 변경(가능한 상황도 있고 불가능한 상황도 있음)
	- 쿼리를 2번 분리해서 실행
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Native SQL|Native SQL]]  사용 
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java
  @Test
  public void subQuery() {
    QMember member = QMember.member;
    QMember subMember = new QMember("subMember");

    List<Member> fetch = new JPAQueryFactory(em)
      .selectFrom(member)
      .where(member.age.eq(
        JPAExpressions
          .select(subMember.age.max())
          .from(subMember)
      ))
      .fetch();

    for (Member member1 : fetch) {
      System.out.println("member1 = " + member1);
    }
  }
```