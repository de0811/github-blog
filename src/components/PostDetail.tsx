"use client";

import styles from './PostDetail.module.scss';
import {PostType} from '@/types/post.type';
import {useEffect} from "react";
import Image from 'next/image';
import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';

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

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs && domNode.name === 'img') {
        const { src, alt, style } = domNode.attribs;
        let width = 800; // 기본 너비
        let height = 450; // 기본 높이

        if (style) {
          const widthMatch = style.match(/width:\s*(\d+)px/);
          if (widthMatch) {
            width = parseInt(widthMatch[1], 10);
            // 높이는 너비에 맞춰 비율을 유지하도록 조정할 수 있습니다.
            height = (width / 16) * 9; // 예: 16:9 비율
          }
        }

        return (
          <Image
            src={src}
            alt={alt || 'image from content'}
            width={width}
            height={height}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }} // 반응형 및 스타일
          />
        );
      }
    },
  };

  return (
    <article className={styles.detail}>
      <h1 className={styles.title}>{post.title}</h1>
      <div className={styles.meta}>
        <span>작성일: {post.createdAt}</span>
        {post.updatedAt && <span> | 수정일: {post.updatedAt}</span>}
      </div>
      {post.coverImgUrl && (
        <div className={styles.coverContainer}>
          <Image
            className={styles.cover}
            src={post.coverImgUrl}
            alt="cover"
            fill
            style={{ objectFit: 'cover' }}
            priority // LCP(가장 큰 콘텐츠풀 페인트) 요소일 가능성이 높으므로 우선적으로 로드합니다.
          />
        </div>
      )}
      <div className={styles.content}>
        {parse(post.content, options)}
      </div>
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
