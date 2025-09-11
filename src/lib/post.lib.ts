// src/lib/post.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import {PostType, PostMetadata} from '@/types/post.type';
import crypto from 'crypto';
import gfm from 'remark-gfm';
import {remarkCodeBlock, remarkCustomHeaders, remarkInlineCode, remarkText} from "@/lib/obsidian.lib";

const postsDirectory = path.join(process.cwd(), '_posts');
const repositoryName = 'github-blog';

// --- 캐시 객체 ---
let cachedPosts: Map<string, PostType> | null = null;
let cachedPostMetaDatas: PostMetadata[] = [];

/**
 * 주어진 문자열로부터 SHA-256 해시 값을 생성하여 앞 8자리만 반환합니다.
 */
export function generateSlugHash(input: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex').substring(0, 8);
}

/**
 * _posts 디렉터리 및 하위 디렉터리에서 모든 마크다운 파일의 경로 기반 슬러그 목록을 재귀적으로 가져옵니다.
 */
function getAllPostSlugs(dir: string = ''): string[] {
  const currentDir = path.join(postsDirectory, dir);
  let slugs: string[] = [];
  try {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        slugs = slugs.concat(getAllPostSlugs(entryPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        slugs.push(entryPath.replace(/\.md$/, ''));
      }
    }
    return slugs;
  } catch (error) {
    console.error(`Error reading directory ${currentDir}:`, error);
    return [];
  }
}

async function getPostMetaData(slug: string): Promise<PostMetadata | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  try {
    if (!fs.existsSync(fullPath)) return null;

    const fileStats = fs.statSync(fullPath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const fileNameAsTitle = path.basename(slug);
    const title = matterResult.data.title || fileNameAsTitle;
    const createdAt = matterResult.data.createdAt || fileStats.birthtime.toISOString().split('T')[0];
    const updatedAt = matterResult.data.updatedAt || fileStats.mtime.toISOString().split('T')[0];
    const slugHash = generateSlugHash(slug);

    let coverImgUrl = matterResult.data.coverImgUrl as string | undefined;
    if (coverImgUrl && coverImgUrl.startsWith('/images/')) {
      coverImgUrl = `/${repositoryName}${coverImgUrl}`;
    }

    const postMetaData: PostMetadata = {
      slug,
      slugHash,
      title,
      createdAt,
      updatedAt,
      tags       : matterResult.data.tags || [],
      isPublished: matterResult.data.isPublic !== undefined ? matterResult.data.isPublic : false,
      excerpt    : matterResult.data.excerpt,
      coverImgUrl,
      aliases    : matterResult.data.aliases,
      noteUUID   : matterResult.data.noteUUID,
    };

    return postMetaData;
  } catch (error) {
    console.error(`Error reading or parsing post ${slug}.md:`, error);
    return null;
  }
}

export async function getAllPostMetaData(): Promise<PostMetadata[]> {
  if (cachedPostMetaDatas && cachedPostMetaDatas.length > 0) return cachedPostMetaDatas;
  const slugs = getAllPostSlugs();

  const metaList = await Promise.all(
    slugs.map(slug => getPostMetaData(slug))
  );
  cachedPostMetaDatas = metaList.filter((post): post is PostMetadata => post !== null);
  cachedPostMetaDatas = cachedPostMetaDatas.sort((a, b) => {
    if (a.updatedAt && b.updatedAt) {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
    return 0;
  });
  return cachedPostMetaDatas;
}

export async function markdownToHtml(fileContents: string) {
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    // .use(remarkWikiLinks, {basePathToTrim: '2.Ref(데이터 및 정보 저장)/', repositoryName, baseRoute: 'blog'}) // 2. 옵시디언 위키링크 변환 플러그인 실행
    .use(remarkText, {
      repositoryName,
    })
    .use(remarkInlineCode)
    .use(remarkCustomHeaders)
    .use(remarkCodeBlock)
    // .use(remarkParagraph, {})
    .use(gfm) // 1. GFM 플러그인 먼저 실행 (테이블 등 처리)
    // .use(remarkAdmonitions) // 커스텀 Admonition 플러그인 사용
    .use(html, {sanitize: false}) // 2. HTML 변환 플러그인 실행
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  return {matterResult, contentHtml};
}

/**
 * 주어진 경로 기반 슬러그에 해당하는 게시물 데이터를 가져오고, 캐싱
 */
export async function getPostData(slug: string): Promise<PostType | null> {
  if (!cachedPosts) cachedPosts = new Map();

  if (cachedPosts.has(slug)) {
    console.log(cachedPosts.get(slug));
    return cachedPosts.get(slug)!;
  }
  console.log(`Cache miss for slug: ${slug}`);

  const fullPath = path.join(postsDirectory, `${slug}.md`);
  try {
    if (!fs.existsSync(fullPath)) {
      console.warn(`Post not found for slug: ${slug} at path: ${fullPath}`);
      return null;
    }

    const fileStats = fs.statSync(fullPath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const {matterResult, contentHtml} = await markdownToHtml(fileContents);
    // 옵시디언 처리 필요
    // contentHtml = await convertWikiLinksToLinks(contentHtml, "2.Ref(데이터 및 정보 저장)/", repositoryName, "blog");

    let coverImgUrl = matterResult.data.coverImgUrl as string | undefined;
    if (coverImgUrl && coverImgUrl.startsWith('/images/')) {
      coverImgUrl = `/${repositoryName}${coverImgUrl}`;
    }

    const fileNameAsTitle = path.basename(slug);
    const title = matterResult.data.title || fileNameAsTitle;
    // console.log(title, contentHtml);
    const createdAt = matterResult.data.createdAt || fileStats.birthtime.toISOString().split('T')[0];
    const updatedAt = matterResult.data.updatedAt || fileStats.mtime.toISOString().split('T')[0];
    const slugHash = generateSlugHash(slug);

    const postData: PostType = {
      slug,
      slugHash,
      content: contentHtml,
      markdownContent: fileContents, // 원본 Markdown 내용도 저장
      title,
      createdAt,
      updatedAt,
      tags: matterResult.data.tags || [],
      isPublished: matterResult.data.isPublic !== undefined ? matterResult.data.isPublic : false,
      excerpt: matterResult.data.excerpt,
      coverImgUrl,
      aliases: matterResult.data.aliases,
      noteUUID: matterResult.data.noteUUID,
    };

    cachedPosts.set(slug, postData);
    return postData;
  } catch (error) {
    console.error(`Error reading or parsing post ${slug}.md:`, error);
    return null;
  }
}

/**
 * 모든 게시물 데이터를 날짜(createdAt) 내림차순으로 정렬하여 가져옴
 */
export async function getAllPostsData(): Promise<PostType[]> {
  const identifiers = await getAllPostMetaData();
  const allPostsData = await Promise.all(
    identifiers.map(async ({ slug }) => getPostData(slug))
  );
  const validPosts = allPostsData.filter(post => post !== null) as PostType[];
  return validPosts.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
}

/**
 * (선택) 캐시 무효화 함수 - 게시물 변경 시 호출
 */
export function clearPostCache() {
  cachedPosts = null;
  cachedPostMetaDatas = [];
}


/**
 * 커스텀 Admonition 플러그인
 * Obsidian의 [!NOTE] 스타일 구문을 HTML <div>로 변환합니다.
 */
// function remarkAdmonitions() {
//   return (tree: Root) => {
//     visit(tree, 'blockquote', (node: Blockquote, index, parent) => {
//       if (!parent || typeof index !== 'number' || node.children.length === 0 || node.children[0].type !== 'paragraph') {
//         return;
//       }
//
//       const paragraph = node.children[0];
//       if (paragraph.children.length === 0 || paragraph.children[0].type !== 'text') {
//         return;
//       }
//
//       const textNode = paragraph.children[0];
//       const admonitionMatch = textNode.value.match(/^\[!(\w+)\]\s*(.*)/s);
//
//       if (!admonitionMatch) {
//         return;
//       }
//
//       const [, type, titleText] = admonitionMatch;
//       const admonitionType = type.toLowerCase();
//
//       // Admonition 제목 노드 생성
//       const titleNode = {
//         type: 'paragraph',
//         children: [{ type: 'text', value: titleText || type.charAt(0).toUpperCase() + type.slice(1) }],
//         data: { hProperties: { className: 'admonition-title' } }
//       };
//
//       // Admonition 본문 내용 노드들
//       // 기존 첫 문단의 `[!NOTE]` 부분을 제거하고 나머지 자식 노드들을 가져옴
//       const remainingText = textNode.value.substring(admonitionMatch[0].length).trim();
//       const contentNodes = [];
//       if (remainingText) {
//         // 첫 문단에 남은 텍스트가 있으면 추가
//         paragraph.children[0] = { type: 'text', value: remainingText };
//         contentNodes.push(paragraph);
//       } else {
//         // 첫 문단에 `[!NOTE]`만 있었으면 해당 문단은 제외
//         paragraph.children.shift();
//         if (paragraph.children.length > 0) {
//           contentNodes.push(paragraph);
//         }
//       }
//       // 나머지 문단들을 본문에 추가
//       contentNodes.push(...node.children.slice(1));
//
//       // 본문 컨테이너 노드 생성
//       const contentContainerNode = {
//         type: 'element', // 'element' 타입을 사용하여 일반 div처럼 동작하게 함
//         tagName: 'div',
//         properties: { className: 'admonition-content' },
//         children: contentNodes,
//         data: { hName: 'div', hProperties: { className: 'admonition-content' } }
//       };
//
//       // 최종 Admonition div 노드
//       const admonitionNode = {
//         type: 'element',
//         tagName: 'div',
//         properties: { className: `admonition admonition-${admonitionType}` },
//         children: [titleNode, contentContainerNode],
//         data: {
//           hName: 'div',
//           hProperties: { className: `admonition admonition-${admonitionType}` }
//         }
//       };
//
//       // 기존 blockquote 노드를 새로운 admonition 노드로 교체
//       parent.children[index] = admonitionNode as any;
//     });
//   };
// }



// ------------------- Find

export async function findPostMetaDataByUniqueKeyword(keyword: string): Promise<PostMetadata | undefined> {
  const identifiers = await getAllPostMetaData();
  const postMetadatas = (
    identifiers.find(id => id.slug === keyword) ||
    identifiers.find(id => id.slugHash === keyword) ||
    identifiers.find(id => id.title === keyword) ||
    identifiers.find(id => id.aliases?.includes(keyword))
  );

  // 리스트일 경우 하나만 반환
  if (Array.isArray(postMetadatas)) {
    return postMetadatas[0];
  }
  return postMetadatas;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function includesPostMetaDataByKeyword(keyword: string): Promise<PostMetadata | undefined> {
  const identifiers = await getAllPostMetaData();
  return (
    identifiers.find(id => id.slug.includes(keyword)) ||
    identifiers.find(id => id.slugHash.includes(keyword)) ||
    identifiers.find(id => id.title.includes(keyword)) ||
    identifiers.find(id => id.aliases?.includes(keyword)) ||
    identifiers.find(id => id.tags?.includes(keyword))
  );
}

export async function getPostByUniqueKeyword(keyword: string): Promise<PostType | null> {
  const identifier = await findPostMetaDataByUniqueKeyword(keyword);
  if (!identifier) {
    console.warn(`Post not found for keyword: ${keyword}`);
    return null;
  }
  return getPostData(identifier.slug);
}
