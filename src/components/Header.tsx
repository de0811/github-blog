// src/components/Header.tsx
"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Header.module.scss';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 테마 변경 함수
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', darkMode ? 'light' : 'dark');
  };

  // 클라이언트 사이드에서만 실행되도록 useEffect 사용
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  // 검색 제출 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색 로직 구현
    console.log('검색어:', searchQuery);
    // 검색 페이지로 이동 로직 추가
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">Blog</Link>
        </div>

        <nav className={styles.navigation}>
          <Link href="/about" className={styles.navLink}>About</Link>
        </nav>

        <div className={styles.actions}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              검색
            </button>
          </form>

          <button
            onClick={toggleDarkMode}
            className={styles.themeToggle}
            aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}