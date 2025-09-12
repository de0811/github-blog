// src/components/Comments.tsx
'use client';

import { useEffect, useRef } from 'react';

interface CommentsProps {
  title: string;
}

export default function Comments({ title }: CommentsProps) {
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!commentsRef.current) return;

    // 기존 giscus 스크립트가 있다면 제거
    const existingScript = commentsRef.current.querySelector('script');
    if (existingScript) {
      existingScript.remove();
    }

    // giscus 스크립트 생성
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'de0811/github-blog');
    script.setAttribute('data-repo-id', 'R_kgDONYCPkw'); // 실제 Repository ID로 업데이트 필요
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDONYCPk84CkwuJ'); // 실제 Category ID로 업데이트 필요
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', title);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'ko');
    script.crossOrigin = 'anonymous';
    script.async = true;

    commentsRef.current.appendChild(script);
  }, [title]);

  return (
    <div className="comments-container">
      <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>💬 댓글</h3>
      <div ref={commentsRef} />
      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f6f8fa', borderRadius: '6px', fontSize: '0.9rem', color: '#586069' }}>
        💡 <strong>댓글 시스템 설정 안내:</strong><br/>
        댓글 기능을 사용하려면 GitHub Repository에서 Discussions를 활성화해야 합니다.<br/>
        자세한 설정 방법은 <code>DISCUSSIONS_SETUP.md</code> 파일을 참고하세요.
      </div>
      <style jsx>{`
        .comments-container {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid #e1e4e8;
        }
        
        @media (prefers-color-scheme: dark) {
          .comments-container {
            border-top-color: #30363d;
          }
        }
      `}</style>
    </div>
  );
}