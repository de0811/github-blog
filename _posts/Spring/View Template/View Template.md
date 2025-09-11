---
aliases:
  - 뷰 템플릿
  - View Template
tags:
  - Java
  - Spring
  - spring/ViewTemplate
---
# View Template
뷰 템플릿을 거쳐 HTML 생성되고 뷰가 응답을 만들어서 전달
## 뷰 템플릿 기본 경로
- `src/main/resources/templates`

## [[2.Ref(데이터 및 정보 저장)/Spring/View Template/JSP]]
## 왜 만들어졌나?
- JAVA 소스로 HTML 동적 소스 생성의 어려움으로 만들어짐
- View 부분을 담당
### 특징
- 속도 느림, 기능 부족

## 프리마커(Freemarker ), 벨로시티(velocity)
### 특징
- 속도 문제 해결, 다양한 기능
- 발전하지 않음

## [[2.Ref(데이터 및 정보 저장)/Spring/View Template/타임리프(Thymeleaf)]]
- 내츄럴 템플릿 : HTML 모양을 유지하면서 뷰 템플릿 적용 가능
- [[2.Ref(데이터 및 정보 저장)/Spring/Spring boot]] 와 강력한 기능 통합
- 최선의 선택, 단 성능은 [[#프리마커(Freemarker ), 벨로시티(velocity)]] 가 훨씬 빠름

## 머스테치(Mustache)
