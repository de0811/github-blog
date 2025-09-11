---
aliases:
  - "@Entity"
  - 엔티티
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 엔티티로 지정
---
# @Entity
- 엔티티로 지정
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/JPA|JPA]] 가 관리하는 엔티티
```java
@Documented
@Target(TYPE)
@Retention(RUNTIME)
public @interface Entity {
	String name() default "";
}
```
> `name` : 기본적으로 클래스의 이름과 동일
## 생명 주기
- **비영속 (new/transient)**
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]와 전혀 관계가 없는 **새로운** 상태
- **영속 (managed)**
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]에 **관리**되는 상태
- **준영속 (detached)**
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]에 저장되었다가 **분리**된 상태
- **삭제 (removed)**
	- **삭제**된 상태
## 제약 사항
- 기본 생성자 필수 ([[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]] 없는 [[public]] 또는 [[protected]] 생성자)
- [[final]] 클래스, [[enum]], [[interface]], `inner` 클래스 사용 **불가**
- 저장할 필드에 [[final]] 사용 **불가**
```java title:"JPA 사용시 필수로 필요한 기본 생성자" hl:3
@Entity  
public class Item {  
	public Item() {}
	
    @Id  
    @GeneratedValue(strategy = GenerationType.IDENTITY)  
    private Long id;  
  
    @Column(name = "item_name", length = 10)  
    private String itemName;  
    private Integer price;  
    private Integer quantity;  
  
    public Item() {  
    }  
    public Item(String itemName, Integer price, Integer quantity) {  
        this.itemName = itemName;  
        this.price = price;  
        this.quantity = quantity;  
    }  
}
```