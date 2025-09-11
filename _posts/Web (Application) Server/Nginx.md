---
aliases:
  - Nginx
tags:
  - WebServer
  - Nginx
---

## Nginx VS Apache
| 이름   | 처리 방식    | 사용자가 많을 시                                           |
| ------ | ------------ | ---------------------------------------------------------- |
| Nginx  | Event-driven | 적은 쓰레드로 다수의 연결을 효과적으로 처리                |
| Apache | 1 pipe       | 사용자 수 대로 파이프를 연결하여 메모리 및 CPU 낭비가 심함 |

### Apache 처리 방식
![[Pasted image 20231025205424.png]]
### Nginx 처리 방식
![[Pasted image 20231025205442.png]]


