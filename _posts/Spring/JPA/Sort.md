---
aliases:
  - Sort
tags:
  - Spring
  - Spring/JPA
  - spring/Repository
특징: Spring 정렬 클래스
---
# Sort
- Spring 정렬 클래스
- `org.springframework.data.domain.Sort`
## 🚨 주의사항
## 🔍 속성 설명
### 📌 `Sort.Direction`
- `ASC` : 오름차순
- `DESC` : 내림차순
## 🛠 사용 예제
```java title:"page 추출을 위한 예제"
public interface MemberRepository extends JpaRepository<Member, Long> {
  Page<Member> findByAge(int age, Pageable pageable);
}

PageRequest pageRequest = PageRequest.of(0, 3, Sort.by(Sort.Direction.DESC, "username"));
Page<Member> page = memberRepository.findByAge(age, pageRequest);
```