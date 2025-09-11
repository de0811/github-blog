---
aliases:
  - 그라파나
  - Grafana
  - Grafana(그라파나)
  - 그라파나(Grafana)
tags:
  - Spring
  - Spring/모니터링
특징: DB에 있는 데이터를 불러서 사용자가 보기 편하게 보여주는 대시보드
---
# 그라파나
- DB에 있는 데이터를 불러서 사용자가 보기 편하게 보여주는 대시보드

## 사용 방법
- 사용 전 필수 준비 사항
	- 애플리케이션 실행
	- [[2.Ref(데이터 및 정보 저장)/Spring/모니터링/Prometheus(프로메테우스)|Prometheus(프로메테우스)]] 실행
	- 그라파나 실행
- [그라파나 다운로드](https://grafana.com/grafana/download)
- 사이트에 나와 있는 방법대로 설치 진행
- 설치된 폴더의 bin 폴더에서 실행
	- `./bin/grafana-server`
- http://localhost:3000/ 접속
	- 로그인 화면에서 admin/admin 으로 접속
- 프로메테우스 연결
	- 메뉴 -> Connections -> Data sources 선택 화면에 보이는 프로메테우스 선택
	- ![[config/AttachedFile/Pasted image 20250117163953.png|400]]
	- Connection -> [[2.Ref(데이터 및 정보 저장)/Spring/모니터링/Prometheus(프로메테우스)|Prometheus(프로메테우스)]] 주소 입력
	- ![[config/AttachedFile/Pasted image 20250117164219.png]]
	- 이후 Save & Test 눌러서 정상임을 확인
	- Menu -> Dashboards -> 화면 UI에서 new -> New Dashboard
	- 적당히 설정하고 save dashboard 버튼 클릭
	- 이름 적당히 지정 후 Save
### 배포된 Dashboard 사용 방법
- [공개 Dashboard](https://grafana.com/grafana/dashboards/?search=spring) 해당 위치에서 사용할 Dashboard 선택한 후 `copy ID to clipboard` 버튼 선택
- 사용하는 그라파나에서 `Dashboard` -> `new` -> `import` -> Load 할 위치에 아까 저장한 값 입력 -> `Load` 버튼 클릭
- 최하단 선택 부분에서 [[2.Ref(데이터 및 정보 저장)/Spring/모니터링/Prometheus(프로메테우스)|Prometheus(프로메테우스)]]  선택 후 `Import` 버튼 클릭