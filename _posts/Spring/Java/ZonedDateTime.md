---
aliases:
  - ZonedDateTime
tags:
  - Java
  - DateTime
특징: 
---
# ZonedDateTime
날짜, 시간, 시간대 정보를 함께 가진 클래스
시간대 정보인 GMT, UTC 같은 시간대 정보도 포함
[[2.Ref(데이터 및 정보 저장)/Spring/Java/LocalDateTime|LocalDateTime]] 다른 점은 시간대 정보를 포함한다는 것
java8 버전부터 도입

`java.time` 패키지에 존재

```java
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class Main {
    public static void main(String[] args) {
        ZonedDateTime zonedDateTime = ZonedDateTime.now();
        System.out.println(zonedDateTime);

        // 시간대를 포함한 날짜와 시간을 문자열로 변환
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z");
        String formattedDateTime = zonedDateTime.format(formatter);
        System.out.println(formattedDateTime);
    }
}
```

데이터의 전달 방식은 [ISO 8601](https://ko.wikipedia.org/wiki/ISO_8601) 규칙을 따름
## 데이터의 전달 예시
미국 `2024-02-23T02:17:12.099274573Z[Etc/UTC]`
한국 `2024-02-23T10:58:58.200+09:00[Asia/Seoul]`

## 장점
- 날짜, 시간, 시간대 모두 표현 가능
- 시간대 변환을 쉽게 처리
## 단점
- 시간대 정보를 항상 고려해야하기에 시간대 정보가 필요없는 상황에 복잡해짐