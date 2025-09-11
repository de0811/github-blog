---
aliases:
  - Git 외부 저장소 연동
tags:
  - GIT
특징:
isPublic: false
---
# Git 외부 저장소 연동
- 다른 Git 저장소를 내 프로젝트의 하위 폴더처럼 사용하는 방법
- [[2.Ref(데이터 및 정보 저장)/GIT/Git Submodule|Git Submodule]]과 [[2.Ref(데이터 및 정보 저장)/GIT/Git Subtree|Git Subtree]] 두 가지 방식이 있음

## Submodule vs Subtree 비교

| 구분 | Git Submodule | Git Subtree |
| :--- | :--- | :--- |
| **개념** | 저장소 **링크** | 저장소 **복사/병합** |
| **사용 복잡성** | **높음** (별도 명령어 필요) | **낮음** (일반 Git 명령어 사용) |
| **`clone` 후 추가 작업** | **필요** (`submodule update`) | **불필요** |
| **히스토리 관리** | 분리 | 부모 프로젝트에 통합 |
