---
aliases:
  - WAR
tags:
  - Spring
  - WebApplicationServer
  - WAS
  - WebServer
  - Java
특징:
---
# WAR(Web Application Archive)
JAR 파일이 JVM 위에서 실행된다면, [[2.Ref(데이터 및 정보 저장)/Web (Application) Server/Web Application Server(WAS)|WAS]] 에서 동작하기 위한 파일

## war 푸는 방법
```sh title:"war 풀기"
jar -xvf xxx.war
```

## 폴더 구조
`WEB-INF/classes` : 소스코드
`WEB-INF/lib` : 각종 추가한 lib

