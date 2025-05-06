// src/components/PostCard.tsx
import Link from 'next/link';
import Image from 'next/image'; // Next.js Image 컴포넌트 사용
import styles from './PostCard.module.scss';
import { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className={styles.postCard}>
      {post.coverImgUrl && (
        <Link href={`/blog/${post.slug}/`} className={styles.coverImageLink}>
          <Image
            src={post.coverImgUrl}
            alt={`${post.title} cover image`}
            width={400} // 실제 이미지 크기나 원하는 크기로 조절
            height={200} // 실제 이미지 크기나 원하는 크기로 조절
            className={styles.coverImage}
            priority // LCP(Largest Contentful Paint) 이미지일 경우 추가
          />
        </Link>
      )}
      <div className={styles.cardContent}>
        <Link href={`/blog/${post.slug}/`} className={styles.postTitleLink}>
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