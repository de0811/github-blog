---
aliases:
  - plantuml
tags:
  - Obsidian
  - Obsidian/plugin
특징:
isPublic: true
---
# plantuml
uml 적는 플러그인
[설명서](https://pdf.plantuml.net/PlantUML_Language_Reference_Guide_ko.pdf)

각종 필터 동작
```plantuml
@startuml
Class01 <|-- Class02
Class03 *-- Class04
Class05 o-- Class06
Class07 .. Class08
Class09 -- Class10
@enduml
```

```plantuml
@startuml
abstract        abstract
abstract class  "abstract class"
annotation      annotation
circle          circle
()              circle_short_form
class           class
class           class_stereo  <<stereotype>>
diamond         diamond
<>              diamond_short_form
entity          entity
enum            enum
exception       exception
interface       interface
metaclass       metaclass
protocol        protocol
stereotype      stereotype
struct          struct
@enduml
```
```
@startuml
abstract        abstract
abstract class  "abstract class"
annotation      annotation
circle          circle
()              circle_short_form
class           class
class           class_stereo  <<stereotype>>
diamond         diamond
<>              diamond_short_form
entity          entity
enum            enum
exception       exception
interface       interface
metaclass       metaclass
protocol        protocol
stereotype      stereotype
struct          struct
@enduml
```


```plantuml
@startuml
title Spring AOP - Advisor, Pointcut, Advice, Proxy

autonumber
participant 사용자 as a
participant "자동 프록시 생성기" as b 
participant "스프링 컨테이너" as c

a -> b : @Bean 객체 전달
b -> c : Advisor 모두 가져오기
b -> b : 객체가 Advisor의 Pointcut 조건에 맞는 모든 Advisor 적용하여 Proxy 객체 생성
b -> c : @Bean 객체 또는 적용된 Proxy 객체 등록
@enduml
```