---
aliases:
  - application.properties
tags:
  - Spring
  - Spring/Configration
특징: 외부 설정 파일
---
# application.properties
- 실행되는 파일의 바로 옆에 해당 이름으로 존재하면 Spring 설정 파일로 사용
- 사용하는 표기법 방식은 [[2.Ref(데이터 및 정보 저장)/개발 이론/Kebab Case|케밥 표기법]]을 사용
- [Spring 지원 속성 변환기](https://docs.spring.io/spring-boot/reference/features/external-config.html#features.external-config.typesafe-configuration-properties.conversion)
## 우선순위
- 사실 읽는 순서대로 덮어쓰기 때문에 우선순위 발생
- 더 유연한 것이 우선권을 가짐
- 범위가 넓은 것 보다 좁은 것이 우선권을 가짐
1. jar 외부 `application-{profile}.properties`
2. jar 외부 `application.properties`
3. jar 내부 `application-{profile}.properties`
4. jar 내부 `application.properties`
## 외부 파일 분리 사용 방법
- `src/main/resources/application.properties` 에서 각 상황에 맞는 profile 지정 가능
![[config/AttachedFile/Pasted image 20250115135027.png]]
- `--spring.profiles.active=dev` 외부 데이터를 통해 지정 (다중 선택도 가능, 중복일 경우 마지막에 읽는 것을 덮어 씌움)
- ex ) `java -Dspring.profiles.active=prod -jar external-0.0.1-SNAPSHOT.jar`
## 외부 파일 합체 사용 방법
- 하나의 파일에서 profile 구분하여 설정
- `properties`에서 하나의 프로파일 구분으로 `#---` 또는 `!---` 사용하여 구간을 분리
- `yml`에서 하나의 프로파일 구분 방법으로 `---` 으로 구분
- **주의** : 구분 기호에는 선행 공백 또는 주석이 있어서는 안됨
- 이름을 정하는 방법으로 `spring.config.activate.on-profile` 사용
- **주의 : 아무것도 지정하지 않는다면 default 가 선택(default 는 `spring.config.activate.on-profile`를 지정하지 않은 것을 말함**
- 값 세팅은 위에서 아래로 읽어서 저장(같은 Key 사용의 경우 마지막에 저장되는걸 덮음)
```properties
url=normal.db.com
username=normal_user
password=normal_password
#---
spring.config.activate.on-profile=dev
url=dev.db.com
username=dev_user
password=dev_password
#---
spring.config.activate.on-profile=prod
url=prod.db.com
username=prod_user
password=prod_password
```