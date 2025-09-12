import { Suspense } from 'react';
import { getAllPostsData } from '@/lib/post.lib';
import SearchContent from '@/components/SearchContent';

export default async function SearchPage() {
  // 서버 컴포넌트에서 빌드 시점에 모든 데이터를 가져옵니다.
  const allPosts = await getAllPostsData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {/* 데이터를 클라이언트 컴포넌트에 props로 전달합니다. */}
      <SearchContent allPosts={allPosts} />
    </Suspense>
  );
}
