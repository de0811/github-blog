---
aliases:
  - CaseBuilder
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# CaseBuilder
- [[SQL]] 의 CASE 문과 유사
- 특정 조건에 따라 다른 값을 반환
## ⚙️ 설정
## 🚨 주의사항
- 이건 안쓰는게 이득일 듯
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java title:"단순한 case 사용"
  @Test
  public void basicCase() {
    QMember member = QMember.member;
    List<String> fetch = new JPAQueryFactory(em)
      .select(member.age
        .when(10).then("열살")
        .when(20).then("스무살")
        .otherwise("기타")
      )
      .from(member)
      .fetch();

    for (String s : fetch) {
      System.out.println("s = " + s);
    }
  }
```

```java title:"복잡한 case 사용"
@Test
  public void complexCase() {
    QMember member = QMember.member;
    List<String> fetch = new JPAQueryFactory(em)
      .select(new CaseBuilder()
        .when(member.age.between(0, 20)).then("0 ~ 20살")
        .when(member.age.between(21, 30)).then("21 ~ 30살")
        .otherwise("기타")
      )
      .from(member)
      .fetch();

    for (String s : fetch) {
      System.out.println("s = " + s);
    }
  }
```