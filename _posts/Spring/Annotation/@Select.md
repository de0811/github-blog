---
aliases:
  - "@Select"
tags:
  - Spring
  - Annotation
  - Spring/MyBatis
  - spring/Repository
특징: 
---
# @Select

```java tltle:"MyBatis 에서 SQL 쿼리를 바로 작성하는 방법"
@Mapper
public interface ItemMapper {
  void save(Item item);

  // @Param 붙여주면 파라미터명을 다르게 지정할 수 있음 파라메타가 2개 이상이라면 필수로 작성
  void update(@Param("id") Long id, @Param("updateParam")ItemUpdateDto itemUpdateDto);

  // @Param 안붙여주면 오브젝트의 필드명이 파라미터명 사용
  @Select("select * from item where id = #{id}")
  List<Item> findAll(ItemSearchCond itemSearchCond);

  Optional<Item> findById(Long id);
}
```