// src/app/blog/page.tsx
import styles from './page.module.scss';
import { getAllPostsData } from '@/lib/post.lib';
import PostList from '@/components/PostList';

export default async function BlogListPage() {
  const allPosts = await getAllPostsData();
  const publishedPosts = allPosts.filter(post => post.isPublished === true);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>블로그 전체 글</h1>
      {publishedPosts.length === 0 ? (
        <div className={styles.emptyMessage}>게시물이 없습니다.</div>
      ) : (
        <PostList posts={publishedPosts} />
      )}
    </div>
  );
}