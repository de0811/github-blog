// src/app/blog/page.tsx
import { Suspense } from 'react';
import styles from './page.module.scss';
import { getAllPostMetaData, getCategoryTree } from '@/lib/post.lib';
import BlogPageClient from '@/components/BlogPageClient';
import BlogPageClientSkeleton from '@/components/BlogPageClient.skeleton'; // 스켈레톤 컴포넌트 import

// 이 페이지는 이제 완전히 정적입니다.
export default async function BlogListPage() {
  // 빌드 시점에 모든 데이터를 미리 가져옵니다.
  const categoryTree = await getCategoryTree();
  const allPosts = await getAllPostMetaData();
  const publishedPosts = allPosts.filter(post => post.isPublished === true);

  return (
    <div className={styles.container}>
      {/* Suspense로 클라이언트 컴포넌트를 감싸고, 로딩 중에는 스켈레톤 UI를 보여줍니다. */}
      <Suspense fallback={<BlogPageClientSkeleton />}>
        <BlogPageClient 
          categories={categoryTree} 
          posts={publishedPosts} 
        />
      </Suspense>
    </div>
  );
}
