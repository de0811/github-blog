"use client";

import { useSearchParams } from 'next/navigation';
import { PostMetadata } from '@/types/post.type';
import { CategoryNode } from '@/lib/post.lib';
import CategoryList from './CategoryList';
import PostList from './PostList';
import styles from './BlogPageClient.module.scss'; // 이 컴포넌트만의 스타일 파일을 사용합니다.


type BlogPageClientProps = {
  categories: CategoryNode[];
  posts: PostMetadata[];
};

export default function BlogPageClient({ categories, posts }: BlogPageClientProps) {
  // 1. 클라이언트 사이드에서 searchParams를 가져옵니다.
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');

  // 2. 선택된 카테고리에 따라 게시물을 필터링합니다.
  const filteredPosts = selectedCategory
    ? posts.filter(post => 
        post.tags.some(tag => tag.startsWith(selectedCategory))
      )
    : posts;

  // 3. 페이지 제목을 동적으로 설정합니다.
  const pageTitle = selectedCategory ? `카테고리: ${selectedCategory}` : '블로그 전체 글';

  return (
    <>
      <h1 className={styles.title}>{pageTitle}</h1>
      <div className={styles.mainContent}>
        {/* 왼쪽 사이드바: 카테고리 목록 */}
        <aside className={styles.sidebar}>
          <CategoryList categories={categories} />
        </aside>

        {/* 오른쪽 메인: 게시물 목록 */}
        <main className={styles.postSection}>
          {filteredPosts.length === 0 ? (
            <div className={styles.emptyMessage}>게시물이 없습니다.</div>
          ) : (
            <PostList posts={filteredPosts} />
          )}
        </main>
      </div>
    </>
  );
}
