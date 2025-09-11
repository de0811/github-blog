---
aliases:
  - MyBatis
tags:
  - Spring
  - Spring/MyBatis
  - spring/Repository
특징: 
---
# MyBatis
[공식 문서](https://mybatis.org/mybatis-3/ko/index.html)
```properties title:"MyBatis 설정"
# 패키지 명을 작성해주면 `resultType` 따로 패키지명을 작성할 필요 없음
mybatis.type-aliases-package=hello.itemservice.domain
# [[0.New Note/snake_case|snake_case]] 를 [[0.New Note/camelCase|camelCase]] 로 자동 변환
mybatis.configuration.map-underscore-to-camel-case=true
```

[[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Select|@Select]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Update|@Update]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Delete|@Delete]], [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Insert|@Insert]] [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]] 을 이용해서 `interface` 에서 바로 정의 할 수 있지만 XML 로 작성을 게속 하는 것을 추천
## 장점
- SQL XML로 작성
- 동적 쿼리 작성이 편리
## 단점
- 설정 필요
- 컬럼이나 테이블 명이 바뀌면 모두 찾아서 바꿔야하는데 버그 발생 확률 필연
- 관계형 데이터 베이스와 객체지향은 아주 다른 개념
- SQL 너무 어려움 (난 하기 싫다 증말)
## 사용방법
1. 인터페이스 만들기
2. XML 작성하기
```java title:"ItemMapper.java 인터페이스 작성" hl:1
@Mapper  
public interface ItemMapper {  
  void save(Item item);  
  
  // @Param 붙여주면 파라미터명을 다르게 지정할 수 있음 파라메타가 2개 이상이라면 필수로 작성  
  void update(@Param("id") Long id, @Param("updateParam")ItemUpdateDto itemUpdateDto);  
  
  // @Param 안붙여주면 오브젝트의 필드명이 파라미터명 사용  
  List<Item> findAll(ItemSearchCond itemSearchCond);  
  
  Optional<Item> findById(Long id);  
}
```
1. [[@Mapper]] : 작성함으로 MyBatis 인터페이스 등록
기본은 인터페이스의 패키지 위치와 동일하게 맞춰줘야함
`{java}package hello.itemservice.repository.mybatis;` 인터페이스가 이렇게 구성된 경우
`resources/hello/itemservice/repository/mybatis` 경로에 `ItemMapper.xml` 을 작성
> [!note] XML 파일 경로 수정하기
> XML 파일의 위치를 변경하고 싶다면 `application.properties` 에 `mybatis.mapper-locations=classpath:mapper/**/*.xml` 이런 형식으로 변경하면 설정 완료
> 테스트에도 적용하길 원한다면 테스트의 `application.properties` 에도 수정 하면 설정
```xml title:"ItemMapper.xml"
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="hello.itemservice.repository.mybatis.ItemMapper">
    <insert id="save" parameterType="hello.itemservice.domain.Item" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO
            item
        (
            item_name,
            price,
            quantity
        )
        VALUES
        (
            #{itemName},
            #{price},
            #{quantity}
        )
    </insert>
    <update id="update">
        UPDATE
            item
        SET
            item_name = #{updateParam.itemName},
            price = #{updateParam.price},
            quantity = #{updateParam.quantity}
        WHERE
            id = #{id}
    </update>

    <select id="findById" resultType="hello.itemservice.domain.Item">
        SELECT
            id,
            item_name,
            price,
            quantity
        FROM
            item
        WHERE
            id = #{id}
    </select>
    <select id="findAll" parameterType="hello.itemservice.repository.ItemSearchCond" resultType="Item">
        SELECT
            id,
            item_name,
            price,
            quantity
        FROM
            item
        <where>
            <if test="itemName != null and itemName != ''">
                AND item_name like concat('%', #{itemName}, '%')
            </if>
            <if test="maxPrice != null">
                AND price &lt;= #{maxPrice}
            </if>
        </where>
    </select>
    <delete id="delete" parameterType="java.lang.String">
        DELETE FROM
            item
        WHERE
            id = #{id}
    </delete>
</mapper>
```

```XML title:"첫번째 조건문으로 들어올 경우 MyBatis 자동으로 and 삭제" hl:3,6
<where>  
    <if test="itemName != null and itemName != ''">  
        AND item_name like concat('%', #{itemName}, '%')  
    </if>  
    <if test="maxPrice != null">  
        AND price &lt;= #{maxPrice}  
    </if>  
</where>
```

> [!info] XML 작성시 특수문자 전환 필요
> XML 특성상 <> 문자와 & 문자를 사용할 수 없기 때문에 특수한 방법으로 사용
> - 특수 키워드 사용 방법
> `<` : `&lt;`
> `>` : `&gt;`
> `&` : `&amp;`
> - CDATA 사용 방법
> 시작을 `<![CDATA[`  끝을 `]]>` 처리 가능
> ex) `<![CDATA[ and price <= #{maxPrice} ]]>`
> 단점으로 내부에서 `<if>` 와 `<where>` 처리가 되지 않음

### 동적 쿼리
- `<if>` : 해당 조건을 만족하면 작성
- `choose (when, otherwise)` : switch 구문과 유사, when 구문이 모두 조건이 맞지 않으면 otherwise 사용
- `trim (where, set)` : WHERE 없을 경우엔 삭제해주고 있을 경우 추가해주는 방식
	- `<trim prefix="WHERE" prefixOverrides="AND |OR">` 방식 == `<where><if test="state != null">AND state == ${state} </where>`
- `foreach` : 컬랙션을 반복 처리할 때 사용 - 파라메터로 List 를 넣는 방법이 더 나을지도 모름
상세 설명은 [공식 페이지-동적 SQL](https://mybatis.org/mybatis-3/ko/dynamic-sql.html)  부분에 모두 설명

### 문자열 대체
`#{}` 문법은 ? 넣고 파라미터를 바인딩하는 `PreparedStatement` 를 사용
때로는 파라미터 바인딩이 아닌 문자 그대로를 처리하고 싶을땐 `${}` 사용
그렇지만 `${}` 문법은 SQL Injection 공격을 당할 위험이 있기 때문에 사용하지 않는 것을 추천
`select * from user where + ${column} + = #{value}` 이런 느낌이 아닐까 싶음
```java
@Select("select * from user where ${column} = #{value})
User findByColumn(@Param("column") String column, @Param("value") String value);
```
### 재사용 가능한 SQL 조각
`<sql>` 사용하면 코드 조각으로 재사용 가능
```xml title:"코드 조각 생성"
<sql id="userColumns"> ${alias}.id, ${alias}.username, ${alias}.password </sql>
```

```xml title:"재활용 코드 사용 방법"
<select id="selectUsers" resultType="map">
	select
		<include refid="userColumns"><property name="alias" value="t1"/></include>,
		<include refid="userColumns"><property name="alias" value="t2"/></include>,
	from some_table t1
	cross join some_table t2
</select>
```

### 반환되는 타입을 정의 하는 방법
결과 매핑할때 테이블의 컬럼 이름이 `user_id` 이지만 객체는 `id` 일 경우 보통 `as` 를 이용하여 별칭으로 해결하는 방법이 있지만 많은 경우에는 `resultMap` 을 사용하는 방법
```xml
<resultMap id="userResultMap" type="User">
	<id property="id" column="user_id" />
	<result property="username" column="user_name"/>
	<result property="password" column="hashed_password"/>
</resultMap>

<select id="selectUsers" resultMap="userResultMap">
	select user_id, user_name, hashed_password
	from some_table
	where id = #{id}
</select>
```
### 복잡한 결과 매핑 방법
`<association>` , `<collection>` 사용하여 해결할 수 있음
하지만 성능과 실효성 측면으로 많은 고민이 필요
