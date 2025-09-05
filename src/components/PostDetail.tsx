"use client";

import styles from './PostDetail.module.scss';
import {PostType} from '@/types/post.type';
import {useEffect} from "react";

type Props = { post: PostType };

export default function PostDetail({ post }: Props) {
  // 코드 복사 기능을 위한 useEffect
  useEffect(() => {
    const copyButtons = document.querySelectorAll('.copy-code-button');

    const handleClick = async (event: MouseEvent) => {
      const button = event.currentTarget as HTMLButtonElement;
      const codeBlock = button.closest('.custom-code-block');
      if (!codeBlock) return;

      const codeElement = codeBlock.querySelector('code');
      if (!codeElement) return;

      try {
        await navigator.clipboard.writeText(codeElement.innerText);
        // 사용자에게 복사되었음을 알림 (예: 아이콘 변경 또는 텍스트 표시)
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        button.title = "Copied!";

        setTimeout(() => {
          button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
          button.title = "Copy code";
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        button.title = "Copy failed";
      }
    };

    copyButtons.forEach(button => {
      button.addEventListener('click', handleClick as unknown as EventListener);
    });

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      copyButtons.forEach(button => {
        button.removeEventListener('click', handleClick as unknown as EventListener);
      });
    };
  }, [post.content]); // post.content가 바뀔 때마다 스크립트를 다시 실행

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