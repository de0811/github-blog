import { PostType } from '@/types/post.type';
import PostCard from './PostCard';
import styles from './PostList.module.scss';

type Props = {
  posts: PostType[];
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