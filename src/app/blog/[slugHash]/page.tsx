// src/app/blog/[slugHash]/page.tsx
import { notFound } from 'next/navigation';
import {getAllPostMetaData, getPostByUniqueKeyword} from '@/lib/post.lib';
import PostDetail from '@/components/PostDetail';
import styles from './page.module.scss';

// Next.js 15의 런타임 요구사항을 반영하여 params를 Promise로 타입 지정
type Props = {
  params: Promise<{ slugHash: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  // Next.js 15에서는 params를 사용하기 전에 반드시 await 해야 합니다.
  const { slugHash } = await params;

  const post = await getPostByUniqueKeyword(slugHash);

  if (!post || !post.isPublished) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <PostDetail post={post} />
    </div>
  );
}

export async function generateStaticParams() {
  console.log("static params called");
  const identifiers = await getAllPostMetaData();
  return identifiers.map(id => ({ slugHash: id.slugHash }));
}
