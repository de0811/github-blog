---
aliases:
  - Stream
tags:
  - Java
특징: 
---
# Stream

## Filtering
특정 조건에 맞는 요소만 선택
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
List<Integer> evenNumbers = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
System.out.println(evenNumbers);  // 출력: [2, 4, 6, 8, 10]
```

## Mapping 
각 요소를 특정 방식으로 변환
```java
List<String> names = Arrays.asList("John", "Peter", "Susan");
List<String> upperCaseNames = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
System.out.println(upperCaseNames);  // 출력: [JOHN, PETER, SUSAN]
```

## sorting
요소를 정렬
```java
List<String> names = Arrays.asList("John", "Peter", "Susan");
List<String> sortedNames = names.stream()
    .sorted()
    .collect(Collectors.toList());
System.out.println(sortedNames);  // 출력: [John, Peter, Susan]
```
> 오름차순 정렬

```java
List<String> names = Arrays.asList("John", "Amy", "Brad", "Carl");
List<String> sortedNames = names.stream()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList());
```
> 내림차순 정렬
## Reducing
요소를 하나의 값으로 줄이기
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
int sum = numbers.stream()
    .reduce(0, Integer::sum);
System.out.println(sum);  // 출력: 15
```
> 더하기

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
Optional<Integer> product = numbers.stream()
    .reduce((a, b) -> a * b);
```
> 곱하기

```java
List<String> words = Arrays.asList("Hello", "World");
Optional<String> sentence = words.stream()
    .reduce((a, b) -> a + " " + b);
```
> 문자 더하기
## Collecting
결과를 다양한 형태로 수집
```java
List<String> names = Arrays.asList("John", "Peter", "Susan");
String joinedNames = names.stream()
    .collect(Collectors.joining(", "));
System.out.println(joinedNames);  // 출력: John, Peter, Susan
```
> 리스트로 묶기

```java
List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 3, 3);
Set<Integer> uniqueNumbers = numbers.stream()
    .collect(Collectors.toSet());
```
> Set으로 묶기

```java
List<String> names = Arrays.asList("John", "Amy", "Brad", "Carl");
Map<Integer, List<String>> namesByLength = names.stream()
    .collect(Collectors.groupingBy(String::length));
```
> 문자열 길이별로 그룹화 하기