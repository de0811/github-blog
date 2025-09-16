// src/components/PostCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from './PostCard.module.scss';
import { PostMetadata } from '@/types/post.type'; // PostType 대신 PostMetadata를 import합니다.

interface PostCardProps {
  post: PostMetadata; // 타입을 PostMetadata로 변경합니다.
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className={styles.postCard}>
      {post.coverImgUrl && (
        <Link href={`/blog/${post.slugHash}/`} className={styles.coverImageLink}>
          <Image
            src={post.coverImgUrl}
            alt={`${post.title} cover image`}
            width={400}
            height={200}
            className={styles.coverImage}
            priority // LCP(Largest Contentful Paint) 이미지일 경우 추가
          />
        </Link>
      )}
      <div className={styles.cardContent}>
        <Link href={`/blog/${post.slugHash}/`} className={styles.postTitleLink}>
          <h3 className={styles.postTitle}>{post.title}</h3>
        </Link>
        <p className={styles.postDate}>
          {post.updatedAt} (최초 작성: {post.createdAt})
        </p>
        {post.excerpt && (
          <p className={styles.postExcerpt}>{post.excerpt}</p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
