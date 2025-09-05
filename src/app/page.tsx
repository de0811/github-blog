// src/app/page.tsx
import styles from './page.module.scss';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { getAllPostsData } from '@/lib/post.lib';

// 홈페이지는 비동기 컴포넌트로 구현
export default async function Home() {
  // 실제 게시물 데이터 가져오기
  const allPosts = await getAllPostsData();

  // 공개된 최신 게시물만 필터링
  const publishedRecentPosts = allPosts
    .filter(post => post.isPublished)
    .slice(0, 3); // 최신 게시물 3개만 표시

  // 인기 게시물 - 실제로는 조회수 등으로 정렬할 수 있지만
  // 예시로 공개된 게시물 중 랜덤하게 선택
  const popularPosts = [...allPosts]
    .filter(post => post.isPublished)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>서동민의 개발 블로그</h1>
        <p className={styles.subtitle}>
          웹 개발, 프로그래밍, 그리고 기술에 관한 이야기를 공유합니다.
        </p>
      </section>

      {publishedRecentPosts.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>최신 게시물</h2>
            <Link href="/blog/" className={styles.viewAllLink}>
              모든 글 보기
            </Link>
          </div>
          <div className={styles.postsGrid}>
            {publishedRecentPosts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {popularPosts.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>인기 게시물</h2>
          </div>
          <div className={styles.postsGrid}>
            {popularPosts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}