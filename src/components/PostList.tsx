import { PostMetadata } from '@/types/post.type'; // PostType 대신 PostMetadata를 import합니다.
import PostCard from './PostCard';
import styles from './PostList.module.scss';

type Props = {
  posts: PostMetadata[]; // 타입을 PostMetadata[]로 변경합니다.
};

export default function PostList({ posts }: Props) {
  return (
    <div className={styles.postsGrid}>
      {posts.map(post => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
