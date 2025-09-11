---
aliases:
  - PageableExecutionUtils
  - CountQuery 최적화
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: total 쿼리를 또 날리지 않아도 내부 계산으로 처리 될 경우 내부 계산 처리로 돌리도록 하는 Util
---
# PageableExecutionUtils
- total 쿼리를 또 날리지 않아도 내부 계산으로 처리 될 경우 내부 계산 처리로 돌리도록 하는 Util
- CountQuery 최적화를 위해 사용
- PageableExecutionUtils 사용하는 방법
	- 마지막 페이지일 경우 `offset + 가져온 개수의 size` 계산으로 전체 개수가 계산
	- 첫번째 페이지인데 마지막 페이지라면 `가져온 개수의 size`가 전체 개수로 계산
	- 해당 상황일 때 전체 개수 쿼리를 만들 필요가 없기 때문에 최적화 가능
## ⚙️ 설정
## 🚨 주의사항
## 🔍 속성 설명
```java
public abstract class PageableExecutionUtils {
  private PageableExecutionUtils() {
  }

  public static <T> Page<T> getPage(List<T> content, Pageable pageable, LongSupplier totalSupplier) {
    Assert.notNull(content, "Content must not be null");
    Assert.notNull(pageable, "Pageable must not be null");
    Assert.notNull(totalSupplier, "TotalSupplier must not be null");
    if (pageable.isUnpaged()) {
      return new PageImpl(content, pageable, (long)content.size());
    } else {
      if (isPartialPage(content, pageable)) {
        if (isFirstPage(pageable)) {
          return new PageImpl(content, pageable, (long)content.size());
        }

        if (!content.isEmpty()) {
          return new PageImpl(content, pageable, pageable.getOffset() + (long)content.size());
        }
      }

      return new PageImpl(content, pageable, totalSupplier.getAsLong());
    }
  }

  private static <T> boolean isPartialPage(List<T> content, Pageable pageable) {
    return pageable.getPageSize() > content.size();
  }

  private static boolean isFirstPage(Pageable pageable) {
    return pageable.getOffset() == 0L;
  }
}
```
### 📌
## 🛠 사용 예제
```java title:"PageableExecutionUtils 사용을 통한 total 쿼리 덜 날리도록 최적화" hl:27
  @Override
  public Page<MemberTeamDto> searchPageSimple(MemberSearchCondition condition, Pageable pageable) {
    if( condition == null ) condition = new MemberSearchCondition();
    QMember member = QMember.member;

    List<MemberTeamDto> fetch = jpaQueryFactory
      .select(
        new QMemberTeamDto(
          member.id.as("memberId"),
          member.username,
          member.age,
          member.team.id.as("teamId"),
          member.team.name.as("teamName")
        ))
      .from(member)
      .where(
        usernameEq(condition.getUsername()),
        teamNameEq(condition.getTeamName()),
        ageGoe(condition.getAgeGoe()),
        ageLoe(condition.getAgeLoe())
      )
      .offset(pageable.getOffset())
      .limit(pageable.getPageSize())
      .fetch();

    MemberSearchCondition finalCondition = condition;
    Page<MemberTeamDto> page = PageableExecutionUtils.getPage(fetch, pageable, () -> totalCount(finalCondition));
//    Long total = totalCount(condition);
//    return new PageImpl<>(fetch, pageable, total);
    return page;
  }
```