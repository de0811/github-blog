// src/app/blog/page.tsx
import Link from 'next/link';
import { getAllPostsData } from '@/lib/post';
import { Post } from '@/types/post';
import PostCard from '@/components/PostCard'; // PostCard 컴포넌트 재활용
import styles from './page.module.scss'; // 스타일 파일을 page.module.scss로 변경

export default async function BlogPage() {
  const allPosts: Post[] = await getAllPostsData();
  // const publishedPosts = allPosts.filter(post => post.isPublished);
  const publishedPosts = allPosts;

  if (publishedPosts.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>블로그 게시물</h1>
        <p className={styles.emptyMessage}>아직 게시된 글이 없습니다.</p>
        <Link href="/" className={styles.homeLink}>홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>블로그 게시물</h1>
      <div className={styles.postsGrid}>
        {publishedPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}