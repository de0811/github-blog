---
aliases:
  - 영속성 컨텍스트
  - Persistence
tags:
  - Spring
  - Spring/용어
  - Spring/JPA
특징:
---
# 영속성 컨텍스트
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|Entity]]를 영구 저장하는 환경 이라는 뜻
- 모든 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|Entity]]  영속성 컨텍스트에 저장
- 논리적인 개념
- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/EntityManager|EntityManager]] 통해 접근 가능 
## 영속석 컨텍스트의 관리 기능
- 1차 캐시
	- thread scope 인듯
	- 칼럼으로 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Id]], [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|Entity]], [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/스냅샷]] 을 보관
- 영속 엔티티의 동일성(identity) 보장
	- 똑같은 ID 값을 가져와서 비교했을 때 같은 객체임을 확인 가능
- 트랜잭션을 지원하는 쓰기 지연(Lazy Loading)
	- insert 가 많은 경우 한번에 insert 할 수 있음
- 엔티티 변경 감지(Dirty Checking)
	- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/스냅샷|스냅샷]] 이 있기 때문에 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|Entity]] 와 비교하여 변경 되었는지 확인
	- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/flush|flush]] 통해서 [[DB]]와 동기화 진행
## [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|엔티티]] 상태
- 비영속 상태
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]] 에 저장되지 않은 상태
- 영속 상태
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]에 저장된 상태
- [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/준영속|준영속 상태]]
	- [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]]에 저장된 [[2.Ref(데이터 및 정보 저장)/Spring/용어설명/Entity|Entity]] 를 [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence|영속성 컨텍스트]] 에서 삭제한 상태
