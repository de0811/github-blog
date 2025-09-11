---
aliases:
tags:
  - HTML
특징: 자동 기록
---
# 사용하기 위한 조건
`<input>`/`<select>`/`<textarea>` 요소의 자동완성 기능을 제공하기 위해서는 3가지의 조건 필수
1. `name` 또는 `id` 특성 존재
2. `<form>` 요소의 자식일 것
3. 양식에 button 의 `"submit"` 버튼이 있을 것

아래 css 강제 적용되기 때문에 autofill 될 경우 처리 필요
```css
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
    transition: background-color 5000s ease-in-out 0s;
    -webkit-transition: background-color 9999s ease-out;
    -webkit-box-shadow: 0 0 0px 1000px white inset !important;
    -webkit-text-fill-color: #fff !important;
}
```
> autofill 없애기


