// src/components/BlogPageClient.skeleton.tsx
import styles from './BlogPageClient.module.scss';
import skeletonStyles from './Skeleton.module.scss';

export default function BlogPageClientSkeleton() {
  return (
    <>
      <div className={`${skeletonStyles.skeleton} ${styles.title}`} style={{ height: '2.5rem', width: '40%', margin: '0 auto 2rem auto' }} />
      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <div className={skeletonStyles.skeleton} style={{ height: '300px' }} />
        </aside>
        <main className={styles.postSection}>
          <div className={skeletonStyles.skeleton} style={{ height: '500px' }} />
        </main>
      </div>
    </>
  );
}
