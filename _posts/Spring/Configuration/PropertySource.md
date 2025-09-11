---
aliases:
  - PropertySource
  - CommandLinePropertySource
  - SystemEnvironmentPropertySource
tags:
  - Spring
  - Spring/Configration
특징: 각 외부 설정을 조회하는 인터페이스
---
# PropertySource
- 각 외부 설정을 조회하는 인터페이스
- [[2.Ref(데이터 및 정보 저장)/Spring/Configuration/Environment|Environment]]에서 각 구현체를 가지고 통합으로 관리
## 구현체
### `CommandLinePropertySource`
- 들어온 args를 조회하는 클래스
### `SystemEnvironmentPropertySource`
- OS 설정을 조회하는 클래스