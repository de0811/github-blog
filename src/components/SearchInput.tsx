"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Header.module.scss';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams.get('q') || '';

  const [inputValue, setInputValue] = useState(queryFromUrl);

  // URL이 변경될 때(예: 뒤로가기/앞으로가기) 검색창의 상태를 동기화합니다.
  useEffect(() => {
    setInputValue(queryFromUrl);
  }, [queryFromUrl]);

  // 디바운싱을 적용하여 검색어가 변경되면 URL을 업데이트합니다.
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedQuery = inputValue.trim();

      // 입력된 검색어와 URL의 검색어가 다를 때만 네비게이션을 실행합니다.
      if (trimmedQuery !== queryFromUrl) {
        if (trimmedQuery) {
          router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
        } else {
          // 검색어가 비워졌다면 쿼리 파라미터 없이 검색 페이지로 이동합니다.
          router.push('/search');
        }
      }
    }, 500); // 0.5초 딜레이

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, queryFromUrl, router]);

  return (
    <div className={styles.searchForm}>
      <input
        type="text"
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
}