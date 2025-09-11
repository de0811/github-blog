---
aliases:
  - BooleanExpression
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# BooleanExpression
- 동적 쿼리를 해결하는 방법
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/BooleanBuilder|BooleanBuilder]] 와 같은 사용 이유
- 재활용성이 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/BooleanBuilder|BooleanBuilder]] 보다 높음
## ⚙️ 설정
## 🚨 주의사항
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java title:"BooleanExpression 사용"
@Override  
public List<Item> findAll(ItemSearchCond cond) {  
  QItem item = QItem.item;  
  List<Item> items = queryFactory.select(item)  
    .from(item)  
    .where(likeItemName(cond.getItemName()), priceLessThanEqual(cond.getMaxPrice()))  
    .fetch();  
  
  return items;  
}  
  
private BooleanExpression likeItemName(String itemName) {  
  if (!StringUtils.hasText(itemName)) return null;  
  return QItem.item.itemName.like("%" + itemName + "%");  
}  
  
private BooleanExpression priceLessThanEqual(Integer price) {  
  if (price == null) return null;  
  return QItem.item.price.loe(price);  
}
```

```java title:"재활용성을 높이는 방법"
  private List<Member> searchMember2(String usernameCond, Integer ageCond) {
    QMember member = QMember.member;

    return new JPAQueryFactory(em)
      .selectFrom(member)
      .where(usernameEq(usernameCond), ageEq(ageCond))
      .fetch();
  }

  private BooleanExpression usernameEq(String usernameCond) {
    QMember member = QMember.member;
    return usernameCond != null ? member.username.eq(usernameCond) : null;
  }

  private BooleanExpression ageEq(Integer ageCond) {
    QMember member = QMember.member;
    return ageCond != null ? member.age.eq(ageCond) : null;
  }
```