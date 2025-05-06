// src/app/blog/page.tsx
import styles from '../page.module.scss'; // 기존 page.module.scss 재활용
import PostCard from '@/components/PostCard';
import { Post } from '@/types/post'; // 공통 Post 타입 사용

// 모든 게시물 데이터 (새로운 Post 타입에 맞게 수정)
// 실제 애플리케이션에서는 이 데이터를 API나 파일 시스템에서 가져옵니다.
const allPostsData: Post[] = [
  {
    slug: 'obsidian-tech-docs',
    isPublished: true,
    title: '옵시디언으로 효율적인 기술 문서 관리하기',
    content: '본문 내용입니다. 옵시디언은 마크다운 기반의 강력한 노트 앱입니다...',
    createdAt: '2024-10-15',
    updatedAt: '2024-10-16',
    tags: ['옵시디언', '생산성', '지식관리'],
    excerpt: '옵시디언의 강력한 링크 기능과 플러그인을 활용해 개발 지식을 체계적으로 정리하는 방법을 소개합니다.',
    coverImgUrl: '/images/next.png',
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
    isPublished: true, // 모든 게시물 페이지에서는 일단 true로 가정 (또는 필터링)
    title: 'TypeScript 5.5 주요 변경사항',
    content: 'TypeScript 5.5에서는 데코레이터 메타데이터 관련 기능이 향상되었고...',
    createdAt: '2024-10-05',
    updatedAt: '2024-10-05',
    tags: ['TypeScript', '자바스크립트'],
    excerpt: 'TypeScript의 최신 버전에서 추가된 기능들과 사용 방법에 대해 간략히 소개합니다.',
    coverImgUrl: '/images/spring-security-sample.png',
  },
  {
    slug: 'rust-basics',
    isPublished: true,
    title: 'Rust 프로그래밍 시작하기',
    content: '본문 내용...',
    createdAt: '2024-09-20',
    updatedAt: '2024-09-25',
    tags: ['Rust', '시스템프로그래밍'],
    excerpt: '메모리 안전성과 성능을 중시하는 Rust 언어의 기초를 다룹니다.',
    // coverImgUrl: '/images/rust-logo.png',
  },
  {
    slug: 'unreal-engine-guide',
    isPublished: false, // 비공개 게시물 예시
    title: '언리얼 엔진 시작 가이드 (비공개 초안)',
    content: '언리얼 엔진의 기본 사용법과 블루프린트에 대해 알아봅니다...',
    createdAt: '2024-11-01',
    updatedAt: '2024-11-02',
    tags: ['언리얼엔진', '게임개발', '초안'],
    excerpt: '언리얼 엔진을 처음 접하는 분들을 위한 단계별 가이드입니다. (현재 비공개)',
    coverImgUrl: '/images/next.png',
  }
];

export default function BlogPage() {
  // 모든 게시물 페이지에서는 isPublished 여부에 관계없이 보여주거나,
  // 필요에 따라 필터링할 수 있습니다. 여기서는 모든 게시물을 보여줍니다.
  // const publishedPosts = allPostsData.filter(post => post.isPublished);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          {/* BlogPage의 h1은 sectionHeader 내부 또는 외부에 둘 수 있습니다.
              일관성을 위해 page.tsx와 유사하게 sectionHeader 내부에 두거나,
              페이지 제목으로서 더 강조하고 싶다면 section 바깥이나 sectionHeader 위에 둘 수 있습니다.
              여기서는 sectionHeader 내부에 배치합니다. */}
          <h2>모든 게시물</h2>
        </div>
        {allPostsData.length > 0 ? (
          <div className={styles.postsGrid}>
            {allPostsData.map(post => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p>게시물이 아직 없습니다.</p>
        )}
      </section>
    </div>
  );
}