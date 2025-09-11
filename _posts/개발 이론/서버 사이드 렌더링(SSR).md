---
aliases:
  - 서버 사이드 렌더링(SSR)
  - 서버 사이드 렌더링
  - SSR
tags:
  - 개발/개발이론
  - Nextjs
---
# 서버 사이드 렌더링(SSR)
- [[2.Ref(데이터 및 정보 저장)/개발 이론/클라이언트 사이드 렌더링(CSR)|클라이언트 사이드 렌더링(CSR)]] 반대 개념
- HTML 최종 결과를 서버에서 제작하여 웹 브라우저로 전달
- 주로 정적인 화면에 사용
- ex) JSP, Thymeleaf
# [[0.New Note/Next.js|Next.js]] 
- 기본적인 사전 렌더링 방식
- 요청이 들어올 때 마다 사전 렌더링을 진행
## ⚙️ 설정
## 🚨 주의사항
- 정해진 이름인 `getServerSideProps` 함수 명을 써야함
- 반환에는 `props` 라는 이름으로 반환
## 🔍 속성 설명

### 📌 GetServerSidePropsContext
- getServerSideProps [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]] 로 사용할 수 있으며 각종 정보([[2.Ref(데이터 및 정보 저장)/Javascript/Query String or URL Params or Query Parameters, Path Variable|Query String]] [[2.Ref(데이터 및 정보 저장)/Javascript/Query String or URL Params or Query Parameters, Path Variable|Path Variable]]) 를 가지고 있음
### 📌 `InferGetServerSidePropsType<typeof getServerSideProps>`
- [[2.Ref(데이터 및 정보 저장)/개발 이론/Parameter|파라메터]] 받는 방법
### 📌
## 🛠 사용 예제
```tsx title:"서버사이드 랜더링 방법" hl:20-29,31
export default async function fetchBooks(q?:string) : Promise<BookData[]> {
  let url = 'http://localhost:12345/book'
  if( q ) {
    url += `/search?q=${q}`
  }
  try {
    const response = await fetch(url)
    if (response.ok) {
      const books = await response.json()
      return books
    } else {
      throw new Error()
    }
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getServerSideProps = async (context : GetServerSidePropsContext) => {
  const q = context.query.q;
  const searchBooks = await fetchBooks(q as string);

  return {
    props: {
      searchBooks
    }
  }
}

export default function Page(props:InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const { q } = router.query;

  return (
    <div>
      {props.searchBooks.map((book) => (
      <BookItem key={book.id} {...book} />
      ))}

    </div>
  )
}

Page.getLayout = function getLayout(page:ReactNode) {
  return (
    <SearchableLayout>
      {page}
    </SearchableLayout>
  )
}
```