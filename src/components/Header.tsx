// src/components/Header.tsx
"use client";
import Link from 'next/link';
import {useState, useEffect, Suspense} from 'react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.scss';
import SearchInput from "@/components/SearchInput";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

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


  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.navigation}>
          <div className={styles.logo}>
            <Link href="/">Home</Link>
          </div>

          <Link href="/blog" className={styles.navLink}>Blog</Link>

          <Link href="/about" className={styles.navLink}>About</Link>
        </div>


        <div className={styles.actions}>
          <Suspense fallback={<div className={styles.searchInput} style={{width: '180px'}} /> }>
            <SearchInput />
          </Suspense>

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