import "./globals.css";
import "./callout.css";
import "./inlinecode.css";
// import "./inlineCode.scss"
import "highlight.js/styles/github-dark.css"
import "./codeBlock.css";
import {Metadata} from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title      : "서동민 개발 블로그",
  description: "서동민 개발 블로그",
  openGraph  : {
    title      : "서동민 개발 블로그",
    description: "서동민 개발 블로그",
    // images: ["/thumbnail.png"],
  }
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
    <body>
    <Header/>
    <main>
      {children}
    </main>
    </body>
    </html>
  );
}
