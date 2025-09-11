---
aliases:
  - "@WebServlet"
tags:
  - Spring
  - Annotation
  - Spring/Controller
특징: 서블릿으로 자동으로 등록하는 방법
---
# @WebServlet
[[2.Ref(데이터 및 정보 저장)/Spring/Servlet|서블릿]]으로 자동으로 등록 방법 

```java
/* http://localhost:8080/test */
@WebServlet(name = "TestServlet", urlPatterns = "/test")
public class TestServlet extends HttpServlet {
  @Override
  public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
    System.out.println("TestServlet.service");
    res.getWriter().write("Test Servlet");
  }
}

```