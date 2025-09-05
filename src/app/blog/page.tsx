// src/app/blog/page.tsx
import styles from './page.module.scss';
import PostCard from '@/components/PostCard';
import { getAllPostsData } from '@/lib/post.lib';

export default async function BlogListPage() {
  const allPosts = await getAllPostsData();
  const publishedPosts = allPosts.filter(post => post.isPublished);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>블로그 전체 글</h1>
      {publishedPosts.length === 0 ? (
        <div className={styles.emptyMessage}>게시물이 없습니다.</div>
      ) : (
        <div className={styles.postsGrid}>
          {publishedPosts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}