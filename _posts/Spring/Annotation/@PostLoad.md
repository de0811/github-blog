---
aliases:
  - "@PostLoad"
tags:
  - Spring
  - Spring/JPA
  - Annotation
  - spring/Repository
특징: 
---
# @PostLoad
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 가 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]에 조회된 직후 또는 refresh를 호출한 후(2차 캐시에 저장되어 있어도 호출)
- [EntityListener](https://sterl.org/2017/08/jpa-default-entity-listener/)
![[config/AttachedFile/Pasted image 20250314135919.png|600]]
## ⚙️ 설정
## 🚨 주의사항
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java title:"엔티티에 직접 사용"
@Entity
public class Product {

    @Id
    @GeneratedValue
    public Long id;
    private String name;

    @PrePersist
    public void prePersist() {
        System.out.println("prePersist id = " + id);
    }

    @PostPersist
    public void postPersist() {
        System.out.println("postPersist id = " + id);
    }

    @PostLoad
    public void postLoad() {
        System.out.println("postLoad id = " + id);
    }

    @PreRemove
    public void preRemove() {
        System.out.println("preRemove id = " + id);
    }

    @PostRemove
    public void postRemove() {
        System.out.println("postRemove id = " + id);
    }

}
```

```java title:"별도의 리스너에 등록"
public class ProductListener {

    @PrePersist
    // 특정 타입이 확실하면 특정 타입을 받을 수 있다.
    public void prePersist(Product product) {
        System.out.println("prePersist id = " + product.getId());
    }

    @PostPersist
    // 특정 타입이 확실하면 특정 타입을 받을 수 있다.
    public void postPersist(Product product) {
        System.out.println("postPersist id = " + product.getId());
    }

}

@Entity
@EntityListeners(ProductListener.class)
public class Product {

    @Id
    @GeneratedValue
    public Long id;
    private String name;
    
    // Get ...

}
```