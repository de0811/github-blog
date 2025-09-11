---
aliases:
  - CascadeType
  - 영속성 전이
  - CascadeType.ALL
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: 
---
# CascadeType
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 를 [[영속화]]할 때 연관된 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]]를 함께 [[영속화]]하는 편리함을 제공하는 기능
- 영속성 전이는 연관관계를 매핑하는 것과 아무 관련 없음
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@OneToMany|@OneToMany]] 같이 FK가 없는 곳에서도 한번에 저장하고 등록하기 위해서 사용
## 🚨 주의사항
- 관리를 하나의 엔티티에서 할 경우 사용한다면 좋지만 여러 엔티티에서 사용하는 경우 추천하지 않음
	- 소유자가 하나일 때가 아닌 경우 비추천
### 효율적인 상황
- 하나의 부모가 모두 관리할때
	- ex) 게시판에서 첨부파일을 관리하는 경우, 주문에서 배송 정보와 주문 물품을 관리할 경우
- 소유자가 하나일때
## 🔍 속성 설명
```java
public enum CascadeType {
  ALL,
  PERSIST,
  MERGE,
  REMOVE,
  REFRESH,
  DETACH;

  private CascadeType() {}
}
```
> **`ALL`: 모든 작업(`PERSIST`, `MERGE`, `REMOVE`, `REFRESH`, `DETACH`)을 자식 엔티티에 전파**
> **`PERSIST`: 부모 엔티티가 영속화될 때 자식 엔티티도 영속화**
> `MERGE`: 부모 엔티티가 병합될 때 자식 엔티티도 병합
> **`REMOVE`: 부모 엔티티가 삭제될 때 자식 엔티티도 삭제**
> `REFRESH`: 부모 엔티티가 새로 고침될 때 자식 엔티티도 새로 고침
> `DETACH`: 부모 엔티티가 분리될 때 자식 엔티티도 분리
### 📌
## 🛠 사용 예제