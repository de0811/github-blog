---
aliases:
  - Codeblock
tags:
  - 옵시디언
특징:
noteUUID:
isPublic: true
---
# Codeblock
이게 무엇이다 설명을 적어요
## ⚙️ 설정
## 🚨 주의사항
## 🔍 속성 설명
### 📌
## 🛠 사용 예제
```java
EntityManagerFactory emf = Persistence.createEntityManagerFactory("hello");
EntityManager em = emf.createEntityManager();
```

```java title:"제목" ref:[[0.New Note/Context|Context]]
```

```reference
file: [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence]]
start: 3
end: 5
```

```reference
link: https://github.com/plait-board/drawnix/blob/develop/Dockerfile
```




---


````markdown
# 코드 블록 기능 테스트

## JavaScript 테스트
```js title="자바스크립트 기본 예제" hl_lines="2 5" linenums
// 이 줄은 그냥 주석 (하이라이트 아님)
const message = "Hello Obsidian!"; // 이 줄은 하이라이트 됨
console.log(message);

// 아래는 또 다른 하이라이트 라인
const sum = (a, b) => a + b;
console.log(sum(2, 3));
````

---


```java title:"제목" ref:[[0.New Note/Context|Context]]
```

```reference
file: [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence]]
start: 3
end: 5
```

```reference
link: https://github.com/plait-board/drawnix/blob/develop/Dockerfile
```


## Python 테스트

```python title:"제목 테스트"
print("Hello, World!")  # 1번 줄 하이라이트
x = 10
y = 20
result = x + y   # 4번 줄부터
print(result)    # 5번 줄까지 하이라이트
```

---

## Reference 기능 테스트

```js hl:1,"ello",/#\w{1}/ title:"하이라이트 기능 테스트"
function greet() {
	int x = 10;
	int y = 20;
	int z = 30;
	// #wa = 10;
	
  return "Hello!";
}
```


---

```

---

👉 이걸 그대로 옵시디언에 붙여 넣으면  
- **제목(title)**  
- **줄 번호(linenums)**  
- **특정 줄 하이라이트(hl_lines)**  
- **참조(reference)**  

까지 모두 확인 가능합니다 ✅  

혹시 여기에 **SQL, HTML, Markdown, JSON** 같은 다양한 언어 블록도 추가해드릴까요?
```













---
---
---


---

````markdown
# 옵시디언 코드 블록 종합 테스트

---

## 📌 Java 예제 + ref 속성
```java title:"자바 코드 블록 예제" ref:[[0.New Note/Context|Context]]
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello Obsidian!");
    }
}
````

---

## 📌 Reference 기능 (파일 참조)

```reference
file: [[2.Ref(데이터 및 정보 저장)/Spring/JPA/Persistence]]
start: 3
end: 5
```

---

## 📌 Reference 기능 (외부 링크 참조)

```reference
link: https://github.com/plait-board/drawnix/blob/develop/Dockerfile
```

---

## 📌 Python 예제 (title + linenums + hl_lines)

```python title:"제목" hl:2
print("Hello, World!")  # 1번 줄 하이라이트
x = 10
y = 20
result = x + y   # 4번 줄부터
print(result)    # 5번 줄까지 하이라이트
```

---

## 📌 JS 예제 (정규식, 문자열 하이라이트)

```js
function greet() {
  let x = 10;
  let y = 20;
  let z = 30;
  // #wa = 10;
  
  return "Hello!";
}
```

---

## 📌 JSON 예제 (단순 코드 블록 + title)

```json title:"단순 코드 블록"
{
  "name": "Obsidian",
  "version": "1.0.0",
  "features": ["code block", "highlight", "reference"]
}
```

---

## 📌 SQL 예제 (title + hl_lines)

```sql title:"SQL 예제" hl:3-4
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📌 Markdown 코드 블록 (자체 테스트)

```markdown
# 제목
- 리스트 1
- 리스트 2
**굵게**
_기울임_


---

✅ 이 문서에는 옵시디언에서 코드 블록으로 쓸 수 있는 기능들:  
- **title**  
- **ref**  
- **reference (파일/링크)**  
- **hl_lines**  
- **hl (정규식, 문자열 매칭)**  
- **linenums**  
- 다양한 언어(syntax highlight)  

```