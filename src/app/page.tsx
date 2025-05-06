// src/app/page.tsx
import styles from './page.module.scss';
import Link from 'next/link';
import PostCard from '@/components/PostCard'; // PostCard 컴포넌트 import
import { Post } from '@/types/post'; // 공통 타입 import

// 임시 데이터 (새로운 Post 타입에 맞게 수정)
const recentPosts: Post[] = [
  {
    slug: 'obsidian-tech-docs',
    isPublished: true,
    title: '옵시디언으로 효율적인 기술 문서 관리하기',
    content: '본문 내용입니다. 옵시디언은 마크다운 기반의 강력한 노트 앱입니다...',
    createdAt: '2024-10-15',
    updatedAt: '2024-10-16',
    tags: ['옵시디언', '생산성', '지식관리'],
    excerpt: '옵시디언의 강력한 링크 기능과 플러그인을 활용해 개발 지식을 체계적으로 정리하는 방법을 소개합니다. 이 글에서는...',
    coverImgUrl: '/images/spring-security-sample.png', // 예시 이미지 경로
  },
  {
    slug: 'nextjs-15-update',
    isPublished: true,
    title: 'Next.js 15 업데이트 살펴보기',
    content: 'Next.js 15가 드디어 출시되었습니다. 주요 변경 사항은 다음과 같습니다...',
    createdAt: '2024-10-10',
    updatedAt: '2024-10-11',
    tags: ['Next.js', '웹개발', '프론트엔드'],
    excerpt: 'Next.js 15의 새로운 기능과 개선사항, 그리고 마이그레이션 가이드를 자세히 알아봅니다.',
    // coverImgUrl: '/images/nextjs-logo.png', // 커버 이미지가 없는 경우
  },
  {
    slug: 'typescript-5-5-changes',
    isPublished: false, // 비공개 게시물 예시
    title: 'TypeScript 5.5 주요 변경사항 (초안)',
    content: 'TypeScript 5.5에서는 데코레이터 메타데이터 관련 기능이 향상되었고...',
    createdAt: '2024-10-05',
    updatedAt: '2024-10-05',
    tags: ['TypeScript', '자바스크립트', '초안'],
    excerpt: 'TypeScript의 최신 버전에서 추가된 기능들과 사용 방법에 대해 간략히 소개합니다. (이 글은 아직 초안입니다.)',
    coverImgUrl: '/images/ts-logo.svg',
  }
];

// 인기 게시물은 일단 공개된 게시물 중에서 랜덤 정렬 (실제로는 조회수 등으로 정렬)
const popularPosts: Post[] = [...recentPosts]
  .filter(post => post.isPublished)
  .sort(() => 0.5 - Math.random())
  .slice(0, 3); // 예시로 3개만 표시

export default function Home() {
  // 공개된 최신 게시물만 필터링
  const publishedRecentPosts = recentPosts.filter(post => post.isPublished);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>서동민의 개roro발 블로그</h1>
        <p className={styles.subtitle}>
          웹 개발, 프로그래밍, 그리고 기술에 관한 이야기를 공유합니다.
        </p>
      </section>

      {publishedRecentPosts.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>최신 게시물</h2>
            <Link href="/blog/" className={styles.viewAllLink}>
              모든 글 보기
            </Link>
          </div>
          <div className={styles.postsGrid}>
            {publishedRecentPosts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {popularPosts.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>인기 게시물</h2>
            {/* 인기 게시물은 모든 글 보기 링크가 없을 수도 있음 */}
          </div>
          <div className={styles.postsGrid}>
            {popularPosts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}