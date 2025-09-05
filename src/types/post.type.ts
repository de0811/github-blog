// src/types/post.ts

/**
 * 게시물 식별자 타입
 * - slug: 게시물의 경로 기반 슬러그 (예: 'category/my-post')
 * - slugHash: URL에 사용할 해시 슬러그 (고유 식별자)
 */
export type PostIdentifier = {
  /** 게시물의 경로 기반 슬러그 (URL 경로용, 필수) */
  slug: string;
  /** URL에 사용할 해시 슬러그 (고유 식별자, 필수) */
  slugHash: string;
  /** 게시물 별칭 목록 (옵시디언 Frontmatter, 선택) */
  aliases?: string[];
};

/**
 * 게시물 전체 타입
 * - PostIdentifier를 확장하여 게시물의 모든 정보를 포함
 */
export type PostMetadata = PostIdentifier & {
  /** 공개 여부 (true: 공개, false: 비공개, 필수) */
  isPublished: boolean;
  /** 게시물 제목 (필수) */
  title: string;

  /** 게시물 최초 생성 날짜 (YYYY-MM-DD 형식 권장, 필수) */
  createdAt: string;
  /** 게시물 최종 수정 날짜 (YYYY-MM-DD 형식 권장, 필수) */
  updatedAt: string;
  /** 게시물 태그 목록 (필수) */
  tags: string[];
  /** 게시물 요약/특징 (선택) */
  excerpt?: string;

  /** 옵시디언 노트의 고유 UUID (옵시디언 연동 시 사용, 선택) */
  noteUUID?: string;
  /** 게시물의 커버 이미지 URL (선택) */
  coverImgUrl?: string;
};

export type PostType = PostMetadata & {
  /** 게시물 본문 내용 (Markdown 또는 HTML, 필수) */
  content: string;
  markdownContent: string; // Markdown 형식의 본문 내용 (필수) embed 기능 활용을 위해 사용
}