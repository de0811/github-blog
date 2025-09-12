"use client";

import React, { useRef, useEffect, useCallback } from 'react';

// term prop을 받도록 타입 정의를 수정합니다.
type GiscusProps = {
  term: string;
};

const GiscusComments: React.FC<GiscusProps> = ({ term }) => {
  const ref = useRef<HTMLDivElement>(null);

  const setGiscusTheme = useCallback((theme: string) => {
    const iframe = ref.current?.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (iframe) {
      iframe.contentWindow?.postMessage({ giscus: { setTheme: theme } }, 'https://giscus.app');
    }
  }, []);

  useEffect(() => {
    if (!ref.current || !term) {
      return;
    }

    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setGiscusTheme(isDarkMode ? 'dark' : 'light');
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', 'de0811/github-blog');
    script.setAttribute('data-repo-id', 'R_kgDOOkIdZA');
    script.setAttribute('data-category', 'Comment');
    script.setAttribute('data-category-id', 'DIC_kwDOOkIdZM4CvVgG');
    // << 중요 >> 매핑 방식을 'specific'으로 변경하고, term prop을 data-term으로 전달합니다.
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', term);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-lang', 'ko');

    const initialTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    script.setAttribute('data-theme', initialTheme);

    while (ref.current.firstChild) {
      ref.current.removeChild(ref.current.firstChild);
    }
    ref.current.appendChild(script);

    return () => {
      observer.disconnect();
    };
  }, [term, setGiscusTheme]); // term이 변경될 때도 스크립트를 다시 로드하도록 의존성 배열에 추가합니다.

  return <div ref={ref} />;
};

export default GiscusComments;
