"use client";

import styles from './PostDetail.module.scss';
import { PostType } from '@/types/post.type';
import { useEffect } from "react";
import Image from 'next/image';
import parse, { HTMLReactParserOptions, Element } from 'html-react-parser';
import GiscusComments from './GiscusComments'; // Giscus 컴포넌트 import

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

    return () => {
      copyButtons.forEach(button => {
        button.removeEventListener('click', handleClick as unknown as EventListener);
      });
    };
  }, [post.content]);

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.attribs && domNode.name === 'img') {
        const { src, alt, style } = domNode.attribs;
        let width = 800;
        let height = 450;

        if (style) {
          const widthMatch = style.match(/width:\s*(\d+)px/);
          if (widthMatch) {
            width = parseInt(widthMatch[1], 10);
            height = (width / 16) * 9;
          }
        }

        return (
          <Image
            src={src}
            alt={alt || 'image from content'}
            width={width}
            height={height}
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
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
            priority
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
      {/* 게시물 하단에 댓글 컴포넌트 추가하고, 고유 식별자로 slugHash를 전달합니다. */}
      <div className={styles.comments}>
        <GiscusComments term={post.slugHash} />
      </div>
    </article>
  );
}
