// src/types/post.ts
export type Post = {
  /** 노트 파일의 고유 ID 또는 슬러그 (URL 경로용, 필수) */
  slug: string;
  /** 공개 여부 (true: 공개, false: 비공개, 필수) */
  isPublished: boolean;
  /** 노트 제목 (필수) */
  title: string;
  /** 노트 본문 내용 (Markdown 또는 HTML, 필수) */
  content: string;
  /** 노트 최초 생성 날짜 (YYYY-MM-DD 형식 권장, 필수) */
  createdAt: string;
  /** 노트 최종 수정 날짜 (YYYY-MM-DD 형식 권장, 필수) */
  updatedAt: string;
  /** 노트 태그 목록 (필수) */
  tags: string[];
  /** 게시물 특징 */
  excerpt?: string;
  /** 노트 별칭 목록 (옵시디언 Frontmatter, 선택적) */
  aliases?: string[];
  /** 옵시디언 노트의 고유 UUID (옵시디언 연동 시 사용, 선택적) */
  noteUUID?: string;
  /** 노트의 커버 이미지 URL 이미지를 사용 했다면 사용 */
  coverImgUrl?: string; //
};