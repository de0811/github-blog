---
aliases:
  - Git Submodule
tags:
  - GIT
특징: 외부 저장소를 특정 커밋 지점으로 링크(Link)하는 방식
isPublic: false
---
# Git Submodule
- 외부 저장소를 특정 커밋 지점으로 **링크(Link)**하는 방식
## 특징 및 장단점
- **독립성 (장점)**
    - 부모 프로젝트는 서브모듈의 특정 커밋만 참조
    - 서브모듈의 히스토리가 부모와 완전히 분리되어 독립적으로 관리됨
- **복잡성 (단점)**
    - `clone` 후 `submodule update` 등 별도의 명령어가 필요함
    - Git에 익숙하지 않은 팀원은 사용이 어려울 수 있음
## 언제 사용할까
- 외부 라이브러리처럼 **독립성**과 명확한 **버전 관리**가 중요할 때
- 포함된 저장소의 코드를 자주 수정하지 않고, 특정 버전을 가져와 사용할 때
## 주요 명령어
- **추가**: `{sh}git submodule add <저장소 URL> <저장하려는 경로>`
- **클론 시 포함**: `{sh}git clone --recurse-submodules <저장소 URL>`
- **초기화 및 업데이트**: `{sh}git submodule update --init --recursive`
## 사용 예제 (Workflow)
`my-project`가 `shared-library`를 서브모듈로 사용하는 상황을 가정
### 서브모듈 추가하기
#### 서브모듈 추가하기 (최신 커밋 기준)
```sh
# 1. my-project 폴더에서 submodule add 실행
git submodule add https://github.com/user/shared-library.git libs/shared

# 2. 상태 확인: .gitmodules 파일과 libs/shared 폴더가 추가됨
git status
# On branch main
# Changes to be committed:
#   new file:   .gitmodules
#   new file:   libs/shared

# 3. 변경사항을 커밋하여 서브모듈 추가 완료
git commit -m "Add shared-library submodule"
```
#### 특정 Tag 서브모듈 추가하기
```sh
# 1. 먼저 일반적인 방식으로 서브모듈을 추가
git submodule add https://github.com/user/shared-library.git libs/shared

# 2. 추가된 서브모듈 폴더로 이동
cd libs/shared

# 3. 원하는 버전(태그)으로 체크아웃
# (만약 태그가 안 찾아지면 git fetch --tags 먼저 실행)
git checkout v1.2.0

# 4. 부모 프로젝트로 돌아옴
cd ../..

# 5. 특정 버전으로 변경된 서브모듈 정보를 커밋
git add libs/shared
git commit -m "Add shared-library submodule at v1.2.0"
```

### 서브모듈이 포함된 프로젝트 클론하기(등록된 모듈 가져오기)
- clone 시 서브모듈 폴더는 비어있으므로, 코드를 받아오는 과정이 필요함
#### 방법 1. 한번에 클론 (권장)
```sh
git clone --recurse-submodules https://github.com/user/shared-library.git
```
#### 방법 2. 따로 실행
```sh
git clone https://github.com/user/shared-library.git
cd my-project
git submodule update --init --recursive
```
### 기존 서브모듈을 특정 버전(Tag)으로 변경하기
- 이미 사용 중인 서브모듈의 버전을 특정 태그로 고정하거나 업데이트하는 방법
```sh
# 1. 변경하려는 서브모듈 폴더로 이동
cd libs/shared

# 2. 원격 저장소의 최신 정보와 모든 태그를 가져옴
git fetch --tags

# 3. 원하는 버전(태그)으로 체크아웃
git checkout v1.2.0

# 4. 부모 프로젝트로 돌아와 상태 확인
cd ../..
git status
# On branch main
# Changes not staged for commit:
#   modified:   libs/shared (new commits)

# 5. 변경된 서브모듈의 버전 정보를 부모 프로젝트에 커밋
git add libs/shared
git commit -m "Update shared-library to v1.2.0"
```
