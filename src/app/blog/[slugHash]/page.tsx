// src/app/blog/[slugHash]/page.tsx
import { getAllPostsData, getPostDataSlugHash } from '@/lib/post'; // getAllPostsData 추가, 불필요한 import 제거
import { Post } from '@/types/post';
import { notFound } from 'next/navigation';
import styles from './page.module.scss';
import Link from 'next/link';

type Props = {
  params: {
    slugHash: string; // 파라미터 이름이 [slugHash]와 일치해야 합니다.
  };
};

// 빌드 시점에 정적 경로 생성
export async function generateStaticParams() {
  const posts = await getAllPostsData(); // 모든 포스트 데이터를 가져옵니다.
  return posts.map((post) => ({
    slugHash: post.slugHash, // 각 포스트의 slugHash를 반환합니다. 키 이름이 params의 키와 일치해야 합니다.
  }));
}

// 페이지 컴포넌트
export default async function PostPage(props: Props) {
  const params = await props.params;
  const slugHash = params.slugHash;
  const post: Post | null = await getPostDataSlugHash(slugHash);

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.meta}>
          <span>{post.createdAt}</span>
          {post.updatedAt && post.createdAt !== post.updatedAt && (
            <>
              <span> (수정: {post.updatedAt})</span>
            </>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map(tag => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}
      </header>

      {post.coverImgUrl && (
        <div className={styles.coverImageContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverImgUrl} alt={post.title} className={styles.coverImage} />
        </div>
      )}

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className={styles.navigation}>
        <Link href="/blog">목록으로 돌아가기</Link>
      </div>
    </article>
  );
}