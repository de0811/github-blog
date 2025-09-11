---
aliases:
  - "@QueryProjection"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @QueryProjection
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/DTO (Data Transfer Object)|DTO (Data Transfer Object)]] 를 Q-Type 으로 생성할 때 사용하는 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]] 
- 생성자에 적용하여 [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 이 해당 생성자를 통해 결과 값 객체를 생성할 때 사용
- 컴파일러 단계에서 에러 확인 가능
## ⚙️ 설정
## 🚨 주의사항
- 이 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|1.애노테이션(annotation)]] 사용하는 것 자체가 [[2.Ref(데이터 및 정보 저장)/Spring/Repository/QueryDSL|QueryDSL]] 에 의존적인 소스가 되기 때문에 불편할 경우 사용하지 않는 것도 방법
	- 이것만큼 깔끔하게 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/DTO (Data Transfer Object)|DTO (Data Transfer Object)]] 를 바로 내보내기 좋은 방법이 없기 때문에 선택 선택 필요
## 🔍 속성 설명
```java
@Documented
@Target({ElementType.CONSTRUCTOR})
@Retention(RetentionPolicy.RUNTIME)
public @interface QueryProjection {}
```
### 📌
## 🛠 사용 예제
```java title:"@QueryProjection 쓰는 방법" hl:7
@Data
@NoArgsConstructor
public class MemberDto {
  private String username;
  private int age;

  @QueryProjection
  public MemberDto(String username, int age) {
    this.username = username;
    this.age = age;
  }
}

@Test
public void findDtoByQueryProjection() {
	QMember member = QMember.member;
	List<MemberDto> fetch = new JPAQueryFactory(em)
		.select(new QMemberDto(member.username, member.age))
		.from(member)
		.fetch();

	for (MemberDto memberDto : fetch) {
		System.out.println("memberDto = " + memberDto);
	}
}
```