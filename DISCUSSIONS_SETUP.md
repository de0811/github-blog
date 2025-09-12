# GitHub Discussions 설정 가이드

이 블로그에 GitHub Discussions 기반의 댓글 시스템을 추가하는 방법입니다.

## 📍 Discussions 설정 위치

GitHub Repository의 **Settings > General > Features** 섹션에서 Discussions를 활성화할 수 있습니다.

## 1. GitHub Repository에서 Discussions 활성화

### 단계별 설정:

1. **GitHub Repository 방문**
   - https://github.com/de0811/github-blog 접속

2. **Settings 탭 클릭**
   - Repository 메인 페이지에서 상단의 "Settings" 탭 클릭

3. **General 섹션에서 Features 찾기**
   - 왼쪽 사이드바에서 "General" 선택 (기본적으로 선택되어 있음)
   - 페이지를 아래로 스크롤하여 "Features" 섹션 찾기

4. **Discussions 활성화**
   - "Features" 섹션에서 "Discussions" 옆의 체크박스 체크
   - 체크하면 "Set up discussions" 버튼이 나타남
   - "Set up discussions" 버튼 클릭

5. **Discussion 카테고리 설정**
   - 기본 카테고리들이 자동으로 생성됨:
     - 📣 Announcements
     - 💡 Ideas  
     - 🙏 Q&A
     - 💬 General
   - 필요에 따라 카테고리 추가/수정 가능

## 2. Giscus 설정 (정확한 ID 가져오기)

### 방법 1: Giscus 웹사이트 사용 (추천)

1. **https://giscus.app 방문**
2. **Repository 섹션에 입력:**
   - `de0811/github-blog`
3. **설정 확인:**
   - Repository는 public이어야 함 ✅
   - giscus app이 설치되어야 함 ✅
   - Discussions가 활성화되어야 함 ✅
4. **Discussions 카테고리 선택:**
   - "General" 또는 원하는 카테고리 선택
5. **생성된 스크립트에서 다음 값들 복사:**
   - `data-repo-id`
   - `data-category-id`

### 방법 2: GitHub API 사용

```bash
# Repository ID 가져오기
curl -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/de0811/github-blog

# node_id 값이 data-repo-id에 해당
```

## 3. Comments 컴포넌트 업데이트

`src/components/Comments.tsx` 파일에서 다음 라인들을 업데이트하세요:

```typescript
script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // giscus에서 복사한 값
script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // giscus에서 복사한 값
```

## 4. 현재 구현된 기능

✅ **Comments 컴포넌트** - 블로그 포스트에 댓글 시스템 추가됨
✅ **자동 테마 감지** - 다크/라이트 모드 지원
✅ **한국어 지원** - 인터페이스 한국어로 설정
✅ **포스트별 댓글** - 각 블로그 포스트마다 개별 댓글 스레드
✅ **설정 안내** - 댓글 섹션에 설정 가이드 표시

## 5. 사용 방법

1. **GitHub Repository에서 Discussions 활성화** (위 1단계 수행)
2. **Giscus에서 정확한 ID 값 가져오기** (위 2단계 수행)
3. **Comments 컴포넌트 업데이트** (위 3단계 수행)
4. **웹사이트 배포** - 변경사항을 배포하면 댓글 시스템이 활성화됨

## 6. 주의사항

- Discussions가 활성화되지 않으면 댓글 시스템이 작동하지 않음
- 댓글 작성을 위해서는 GitHub 계정 필요
- Repository가 public이어야 함 (현재 public으로 설정됨)
- 정확한 `data-repo-id`와 `data-category-id` 값이 필요함

## 7. 문제 해결

### 댓글이 표시되지 않는 경우:

1. **Discussions 활성화 확인**
   - Repository Settings > General > Features > Discussions 체크됨

2. **giscus app 설치 확인**
   - https://github.com/apps/giscus 방문
   - "Install" 또는 "Configure" 클릭
   - de0811/github-blog repository 선택

3. **ID 값 확인**
   - giscus.app에서 정확한 `data-repo-id`와 `data-category-id` 값 사용

4. **브라우저 개발자 도구 확인**
   - Console에서 에러 메시지 확인
   - Network 탭에서 giscus 요청 상태 확인

## 설정 완료 후 확인사항

- [ ] GitHub Repository에서 Discussions 탭이 보이는가?
- [ ] giscus app이 repository에 설치되었는가?
- [ ] 올바른 `data-repo-id`와 `data-category-id` 값을 사용했는가?
- [ ] 블로그 포스트 하단에 댓글 섹션이 나타나는가?
- [ ] GitHub 계정으로 댓글 작성이 가능한가?

## 8. 유용한 링크

- [Giscus 공식 사이트](https://giscus.app)
- [GitHub Discussions 가이드](https://docs.github.com/en/discussions)
- [giscus GitHub Repository](https://github.com/giscus/giscus)