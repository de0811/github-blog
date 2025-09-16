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
let cachedCategoryTree: CategoryNode[] | null = null; // 카테고리 트리 캐시

// --- 타입 정의 ---
export type CategoryNode = {
  name: string;       // 현재 레벨의 표시 이름 (예: 'Repository')
  tag: string;        // 필터링과 링크에 사용할 전체 태그 (예: 'Spring/Repository')
  count: number;      // 이 태그를 가진 게시물 수
  children: CategoryNode[]; // 하위 카테고리 노드들
};


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
    .use(remarkText, { repositoryName })
    .use(remarkInlineCode)
    .use(remarkCustomHeaders)
    .use(remarkCodeBlock)
    .use(gfm)
    .use(html, {sanitize: false})
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  return {matterResult, contentHtml};
}

export async function getPostData(slug: string): Promise<PostType | null> {
  if (!cachedPosts) cachedPosts = new Map();

  if (cachedPosts.has(slug)) {
    return cachedPosts.get(slug)!;
  }

  const fullPath = path.join(postsDirectory, `${slug}.md`);
  try {
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileStats = fs.statSync(fullPath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const {matterResult, contentHtml} = await markdownToHtml(fileContents);

    let coverImgUrl = matterResult.data.coverImgUrl as string | undefined;
    if (coverImgUrl && coverImgUrl.startsWith('/images/')) {
      coverImgUrl = `/${repositoryName}${coverImgUrl}`;
    }

    const fileNameAsTitle = path.basename(slug);
    const title = matterResult.data.title || fileNameAsTitle;
    const createdAt = matterResult.data.createdAt || fileStats.birthtime.toISOString().split('T')[0];
    const updatedAt = matterResult.data.updatedAt || fileStats.mtime.toISOString().split('T')[0];
    const slugHash = generateSlugHash(slug);

    const postData: PostType = {
      slug,
      slugHash,
      content: contentHtml,
      markdownContent: fileContents,
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

export function clearPostCache() {
  cachedPosts = null;
  cachedPostMetaDatas = [];
  cachedCategoryTree = null; // 카테고리 캐시도 함께 초기화
}

// --- Find ---

export async function findPostMetaDataByUniqueKeyword(keyword: string): Promise<PostMetadata | undefined> {
  const identifiers = await getAllPostMetaData();
  return (
    identifiers.find(id => id.slug === keyword) ||
    identifiers.find(id => id.slugHash === keyword) ||
    identifiers.find(id => id.title === keyword) ||
    identifiers.find(id => id.aliases?.includes(keyword))
  );
}

export async function getPostByUniqueKeyword(keyword: string): Promise<PostType | null> {
  const identifier = await findPostMetaDataByUniqueKeyword(keyword);
  if (!identifier) {
    return null;
  }
  return getPostData(identifier.slug);
}

// --- Category --- 

export async function getCategoryTree(): Promise<CategoryNode[]> {
  if (cachedCategoryTree) {
    return cachedCategoryTree;
  }

  const posts = await getAllPostMetaData();
  const tagCounts = new Map<string, number>();

  // 1. 모든 태그를 순회하며 각 태그의 게시물 수를 계산합니다.
  posts.forEach(post => {
    post.tags.forEach(tag => {
      // 'Spring/Repository' 같은 하위 태그가 있을 때, 상위 태그 'Spring'에도 카운트를 더해줍니다.
      const parts = tag.split('/');
      for (let i = 1; i <= parts.length; i++) {
        const partialTag = parts.slice(0, i).join('/');
        tagCounts.set(partialTag, (tagCounts.get(partialTag) || 0) + 1);
      }
    });
  });

  const root: CategoryNode = { name: 'root', tag: 'root', count: 0, children: [] };

  // 2. 태그 목록을 순회하며 트리 구조를 만듭니다.
  // count 변수는 사용하지 않으므로, keys()를 사용하여 태그만 가져옵니다.
  for (const tag of tagCounts.keys()) {
    const parts = tag.split('/');
    let currentNode = root;

    parts.forEach((part, index) => {
      let childNode = currentNode.children.find(child => child.name === part);

      if (!childNode) {
        const currentTag = parts.slice(0, index + 1).join('/');
        childNode = {
          name: part,
          tag: currentTag,
          count: tagCounts.get(currentTag) || 0,
          children: [],
        };
        currentNode.children.push(childNode);
      }
      currentNode = childNode;
    });
  }

  cachedCategoryTree = root.children;
  return cachedCategoryTree;
}
