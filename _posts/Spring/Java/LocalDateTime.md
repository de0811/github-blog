---
aliases:
  - LocalDateTime
tags:
  - Java
  - DateTime
특징: 
---
# LocalDateTime
날짜와 시간을 표현하며 시간대(time-zone) 정보는 포함하지 않음
특정 지역의 시간대에 종속되지 않는 ==지역화되지 않은== 날짜와 시간을 표현하기 위한 클래스
java8 버전부터 도입

`java.time` 패키지에 존재

## 장점
- 날짜, 시간 정보를 표현
- 시간대 정보가 없어도 시간대 변환 없이 날짜와 시간을 처리
## 단점
- 시간대 정보가 없음