"use client";

import styles from './PostDetail.module.scss';
import { PostType } from '@/types/post.type';
// import Prism from "prismjs";
// import 'prismjs/themes/prism-tomorrow.css';
import { useEffect } from "react";

// import "prismjs/components/prism-markup";
// import "prismjs/components/prism-markup-templating";
// import "prismjs/components/prism-bash";
// import "prismjs/components/prism-css";
// import "prismjs/components/prism-diff";
// import "prismjs/components/prism-java";
// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-jsx";
// import "prismjs/components/prism-typescript";
// import "prismjs/components/prism-tsx";
// import "prismjs/components/prism-json";
// import "prismjs/components/prism-markdown";
// import "prismjs/components/prism-python";
// import "prismjs/components/prism-sql";
// import "prismjs/components/prism-yaml";
// import "prismjs/components/prism-c";
// import "prismjs/components/prism-cpp";
// import "prismjs/components/prism-ruby";
// import "prismjs/components/prism-go";
// import "prismjs/components/prism-php";
// import "prismjs/components/prism-swift";
// import "prismjs/components/prism-kotlin";
// import "prismjs/components/prism-rust";

type Props = { post: PostType };

export default function PostDetail({ post }: Props) {
  useEffect(() => {
    // Prism.highlightAll();
  }, [post.content]);

  return (
    <article className={styles.detail}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.meta}>
        <span>작성일: {post.createdAt}</span>
        {post.updatedAt && <span> | 수정일: {post.updatedAt}</span>}
      </div>
      {post.coverImgUrl && (
        <img className={styles.cover} src={post.coverImgUrl} alt="cover" />
      )}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      {post.tags && post.tags.length > 0 && (
        <div className={styles.tags}>
          {post.tags.map(tag => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
}