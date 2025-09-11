---
aliases:
  - "@Resource"
tags:
  - Spring
  - Annotation
  - JSR-250
특징: 
---
# @Resource
- 필드나 메서드에 적용하여 필요한 의존성을 자동으로 주입하는데 사용
- [[@Bean]] 주입할 때 활용되며 이름을 기준으로 주입
- [[JSR-250]] 제공하는 어노테이션
- [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/@Autowired|@Autowired]] 와 기능은 유사하지만 @Resource 는 표준 [[2.Ref(데이터 및 정보 저장)/Spring/Annotation/1.애노테이션(annotation)|어노테이션]] 으로 이름을 기준으로 의존성 주입
- 이름을 생략하면 필드나 프로퍼티의 이름을 사용

```java
import javax.annotation.Resource;
import org.springframework.stereotype.Component;

@Component
public class MyService {

    @Resource(name = "myRepository")
    private MyRepository repository;

    // 또는

    private MyRepository repository;

    @Resource
    public void setRepository(MyRepository repository) {
        this.repository = repository;
    }
}
```