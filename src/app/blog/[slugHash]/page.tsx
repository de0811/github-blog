// src/app/blog/[slugHash]/page.tsx
import { notFound } from 'next/navigation';
import {getAllPostMetaData, getPostByUniqueKeyword} from '@/lib/post.lib';
import PostDetail from '@/components/PostDetail';
import styles from './page.module.scss';

type Props = {
  params: { slugHash: string };
};

export default async function BlogPostPage({ params }: Props) {
  // params는 이제 비동기로 받아야 함
  const { slugHash } = await params;

  // const post = await getPostDataBySlugOrHash(slugHash);
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
  // const identifiers = getAllPostIdentifiers();
  console.log("static params called");
  const identifiers = await getAllPostMetaData();
  return identifiers.map(id => ({ slugHash: id.slugHash }));
}