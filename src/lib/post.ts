// src/lib/post.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Post } from '@/types/post'; // src/types/post.ts 에서 Post 타입을 가져옵니다.
import crypto from 'crypto'; // crypto 모듈 임포트

const postsDirectory = path.join(process.cwd(), '_posts');
const repositoryName = 'github-blog'; // GitHub 리포지토리 이름 (basePath)

/**
 * _posts 디렉터리 및 하위 디렉터리에서 모든 마크다운 파일의 경로 기반 슬러그 목록을 재귀적으로 가져옵니다.
 * @param {string} [dir] - 현재 탐색 중인 디렉터리 경로 (postsDirectory로부터의 상대 경로)
 * @returns {string[]} 경로 기반 슬러그 목록 (예: 'category/sub-category/my-post')
 */
export function getAllPostSlugs(dir: string = ''): string[] {
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
    return []; // 오류 발생 시 빈 배열 반환
  }
}

/**
 * 주어진 문자열로부터 SHA-256 해시 값을 생성하여 앞 8자리만 반환합니다.
 * @param {string} input - 해시를 생성할 문자열
 * @returns {string} 생성된 해시 값 (앞 8자리)
 */
export function generateSlugHash(input: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex').substring(0, 8); // SHA-256 해시의 앞 8자리만 사용
}

export async function getPostDataSlugHash(slugHash: string): Promise<Post | null> {
  const slugs = getAllPostSlugs();
  const postSlug = slugs.find((slug) => generateSlugHash(slug) === slugHash);

  if (!postSlug) {
    console.warn(`Post not found for slugHash: ${slugHash}`);
    return null;
  }

  return getPostData(postSlug);
}

/**
 * 주어진 경로 기반 슬러그에 해당하는 게시물 데이터를 가져옵니다.
 * frontmatter의 title이 없으면 파일명을 사용합니다.
 * frontmatter의 createdAt이 없으면 파일 생성일자를 사용합니다.
 * frontmatter의 updatedAt이 없으면 파일 수정일자를 사용합니다.
 * frontmatter의 coverImgUrl이 /images/로 시작하면 basePath를 추가합니다.
 * @param {string} slug - 게시물 슬러그 (예: 'category/my-post')
 * @returns {Promise<Post | null>} 게시물 데이터 객체 또는 null
 */
export async function getPostData(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  try {
    if (!fs.existsSync(fullPath)) {
      console.warn(`Post not found for slug: ${slug} at path: ${fullPath}`);
      return null;
    }

    const fileStats = fs.statSync(fullPath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    let coverImgUrl = matterResult.data.coverImgUrl as string | undefined;
    if (coverImgUrl && coverImgUrl.startsWith('/images/')) {
      coverImgUrl = `/${repositoryName}${coverImgUrl}`;
    }

    const fileNameAsTitle = path.basename(slug);
    const title = matterResult.data.title || fileNameAsTitle;
    const createdAt = matterResult.data.createdAt || fileStats.birthtime.toISOString().split('T')[0];
    const updatedAt = matterResult.data.updatedAt || fileStats.mtime.toISOString().split('T')[0];
    const slugHash = generateSlugHash(slug); // slugHash 생성

    const postData: Post = {
      slug,
      slugHash, // slugHash 추가
      content: contentHtml,
      title: title,
      createdAt: createdAt,
      updatedAt: updatedAt,
      tags: matterResult.data.tags || [],
      isPublished: matterResult.data.isPublished !== undefined ? matterResult.data.isPublished : true,
      excerpt: matterResult.data.excerpt,
      coverImgUrl,
      aliases: matterResult.data.aliases,
      noteUUID: matterResult.data.noteUUID,
    };

    return postData;
  } catch (error) {
    console.error(`Error reading or parsing post ${slug}.md:`, error);
    return null;
  }
}

/**
 * 모든 게시물 데이터를 날짜(createdAt) 내림차순으로 정렬하여 가져옵니다.
 * @returns {Promise<Post[]>} 정렬된 게시물 데이터 배열
 */
export async function getAllPostsData(): Promise<Post[]> {
  const slugs = getAllPostSlugs();
  const allPostsData = await Promise.all(
    slugs.map(async (slug) => {
      return getPostData(slug);
    })
  );

  const validPosts = allPostsData.filter(post => post !== null) as Post[];

  return validPosts.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
}