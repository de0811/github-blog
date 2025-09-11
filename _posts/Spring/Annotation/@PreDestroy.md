---
aliases:
  - "@PreDestroy"
tags:
  - Spring
  - Annotation
  - JSR-250
특징: "@Bean이 컨테이너에서 소멸되기 전에 실행되어야 할 작업"
---
# @PreDestroy
- [[@Bean]]이 컨테이너에서 소멸되기 전에 실행되어야 할 작업
- [[JSR-250]] 제공하는 어노테이션
- 보통 리소스 정리하거나 연결 종료를 위해 사용
- [[@Singleton]] 에서 유용