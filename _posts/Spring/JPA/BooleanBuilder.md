---
aliases:
  - BooleanBuilder
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# BooleanBuilder
- 동적 쿼리를 해결하는 방법
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/BooleanExpression|BooleanExpression]] 과 같은 사용 이유
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/BooleanExpression|BooleanExpression]] 보다 재활용성이 떨어짐
## ⚙️ 설정
## 🚨 주의사항
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java title:"BooleanBuilder 사용"
  public List<Item> findAllOld(ItemSearchCond cond) {
    String itemName = cond.getItemName();
    Integer maxPrice = cond.getMaxPrice();
    QItem item = QItem.item;
    BooleanBuilder builder = new BooleanBuilder();
    if (StringUtils.hasText(itemName)) {
      builder.and(item.itemName.like("%" + itemName + "%"));
    }
if (maxPrice != null) {
      builder.and(item.price.loe(maxPrice));
    }
    List<Item> items = queryFactory.select(item)
                .from(item)
                .where(builder)
                .fetch();

    return items;
  }
```

```java
@Test
public void dynamicQuery_BooleanBuilder() {
	String usernameParam = "member1";
	Integer ageParam = 10;

	List<Member> result = searchMember1(usernameParam, ageParam);
	Assertions.assertThat(result.size()).isEqualTo(1);
}

private List<Member> searchMember1(String usernameCond, Integer ageCond) {
	QMember member = QMember.member;
	BooleanBuilder builder = new BooleanBuilder();
	if (usernameCond != null) {
		builder.and(member.username.eq(usernameCond));
	}
	if (ageCond != null) {
		builder.and(member.age.eq(ageCond));
	}

	return new JPAQueryFactory(em)
		.selectFrom(member)
		.where(builder)
		.fetch();
}
```