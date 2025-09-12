import {
  findPostMetaDataByUniqueKeyword,
  getPostByUniqueKeyword,
  getPostData,
  markdownToHtml
} from "@/lib/post.lib";
import {
  Blockquote, Code, Heading, Html, Image, InlineCode, Link, Parent, Root, Text
} from "mdast";
import {visit} from "unist-util-visit";
import path from "path";
import {unified} from "unified";
import remarkHtml from 'remark-html';
import hljs from 'highlight.js';
import { deflateSync } from 'zlib';

/*
TODO
- [x] CALLOUT 기능 처리
- [x] highlight 기능 처리
- [x] inlineCode 기능 처리
- [x] code 블록 기능 처리
- [x] embed 기능 처리
- [x] wiki 링크 기능 처리
- [x] plantuml 기능 처리
 */

// PlantUML 인코딩 함수
function encode6bit(b: number) {
  if (b < 10) return String.fromCharCode(48 + b);
  b -= 10;
  if (b < 26) return String.fromCharCode(65 + b);
  b -= 26;
  if (b < 26) return String.fromCharCode(97 + b);
  b -= 26;
  if (b === 0) return '-';
  if (b === 1) return '_';
  return '?';
}

function append3bytes(b1: number, b2: number, b3: number) {
  const c1 = b1 >> 2;
  const c2 = ((b1 & 3) << 4) | (b2 >> 4);
  const c3 = ((b2 & 15) << 2) | (b3 >> 6);
  const c4 = b3 & 63;
  return encode6bit(c1 & 63) +
    encode6bit(c2 & 63) +
    encode6bit(c3 & 63) +
    encode6bit(c4 & 63);
}

function encodePuml(puml: string) {
  const deflated = deflateSync(Buffer.from(puml, 'utf8'));
  let result = '';
  for (let i = 0; i < deflated.length; i += 3) {
    const b1 = deflated[i];
    const b2 = i + 1 < deflated.length ? deflated[i + 1] : 0;
    const b3 = i + 2 < deflated.length ? deflated[i + 2] : 0;
    result += append3bytes(b1, b2, b3);
  }
  return result;
}

/**
 * wikiLink 부위별 분석
 * 더 유연하게 모든 문자 허용 (단, #, |, ]는 분리자로만 사용)
 * ex) [[path/to/file#header|alias]]
 * @param link
 */
function parseWikiLinks(link: string): { path: string; header?: string; alias?: string } {
  // [[...]] 안의 내용만 추출
  const contentMatch = link.match(/\[\[([^\]]+)\]\]/);
  if (!contentMatch || !contentMatch[1]) return {path: link};

  let content = contentMatch[1];
  let alias: string | undefined;

  // 1. Alias 분리 (마지막 '|' 기준)
  const lastPipeIndex = content.lastIndexOf('|');
  if (lastPipeIndex !== -1) {
    alias = content.substring(lastPipeIndex + 1).trim();
    content = content.substring(0, lastPipeIndex).trim();
  }

  // 2. Path와 Header 분리 (첫 '#' 기준)
  const firstHashIndex = content.indexOf('#');
  let path: string;
  let header: string | undefined;

  if (firstHashIndex !== -1) {
    path = content.substring(0, firstHashIndex).trim();
    header = content.substring(firstHashIndex + 1).trim();
  } else {
    path = content.trim();
  }

  return {path, header, alias};
}

/**
 * embeds 부위별 분석
 * ex) [[path/to/file#header|alias]]
 * @param embed
 */
function parseEmbeds(embed: string): { path: string; header?: string; alias?: string } {
  // ![[...]] 안의 내용만 추출
  const contentMatch = embed.match(/\!\[\[([^\]]+)\]\]/);
  if (!contentMatch || !contentMatch[1]) return {path: embed};

  let content = contentMatch[1];
  let alias: string | undefined;

  // 1. Alias 분리 (마지막 '|' 기준)
  const lastPipeIndex = content.lastIndexOf('|');
  if (lastPipeIndex !== -1) {
    alias = content.substring(lastPipeIndex + 1).trim();
    content = content.substring(0, lastPipeIndex).trim();
  }

  // 2. Path와 Header 분리 (첫 '#' 기준)
  const firstHashIndex = content.indexOf('#');
  let path: string;
  let header: string | undefined;

  if (firstHashIndex !== -1) {
    path = content.substring(0, firstHashIndex).trim();
    header = content.substring(firstHashIndex + 1).trim();
  } else {
    path = content.trim();
  }

  return {path, header, alias};
}

/**
 * embed 기능 처리
 - 이미지, PDF, md 파일 등
 ex) 이미지 : ![[path/to/image.png|200]]
 PDF  : ![[path/to/file.pdf]]
 md   : ![[path/to/file#Header|alias]]
 * @param node
 * @param baseBlogPathToTrim
 * @param basePublicPathToTrim
 * @param repositoryName
 * @param baseRoute
 * @param basePublic
 * @param changes
 * @param parent
 * @param index
 */
function textToEmbed(
  node: Text,
  baseBlogPathToTrim: string,
  basePublicPathToTrim: string,
  repositoryName: string,
  baseRoute: string,
  basePublic: string,
  changes: (() => void)[],
  parent: Parent,
  index: number
) {
  return async () => {
    /////////////이 부분부터 내부 로직 처리/////////////////

    const embedRegex = /\!\[\[([^\]]+)\]\]/g;
    if (!embedRegex.test(node.value)) return;

    const newChildren: (Text | Image | Html)[] = [];
    let lastIndex = 0;
    let match;

    embedRegex.lastIndex = 0;
    while ((match = embedRegex.exec(node.value)) !== null) {
      // 정규식 매치 이전의 텍스트를 추가합니다.
      if (match.index > lastIndex) {
        newChildren.push({type: 'text', value: node.value.slice(lastIndex, match.index)});
      }


      const {path: oriPath, header, alias} = parseEmbeds(match[0]);

      let trimPublicPath = oriPath;
      if (basePublicPathToTrim && trimPublicPath.startsWith(basePublicPathToTrim)) {
        trimPublicPath = trimPublicPath.slice(basePublicPathToTrim.length);
      }
      const publicPath = `/${repositoryName ? repositoryName + "/" : ""}${basePublic}/${trimPublicPath}`;

      let trimBlogPath = oriPath;
      if (baseBlogPathToTrim && trimBlogPath.startsWith(baseBlogPathToTrim)) {
        trimBlogPath = trimBlogPath.slice(baseBlogPathToTrim.length);
      }

      const extension = path.extname(trimPublicPath).toLowerCase();

      // 1. 이미지 처리
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(extension)) {
        const altText = alias && isNaN(parseInt(alias, 10)) ? alias : trimPublicPath.split('/').pop() || trimPublicPath;
        const style: { [key: string]: string } = {};
        if (alias && !isNaN(parseInt(alias, 10))) {
          style.width = `${alias}px`;
        }
        newChildren.push({
          type: 'image',
          url : publicPath,
          alt : altText,
          data: {hProperties: {style: Object.keys(style).map(k => `${k}:${style[k]}`).join(';')}}
        } as Image);
      }
      // 2. PDF 처리
      else if (extension === '.pdf') {
        newChildren.push({
          type : 'html',
          value: `<iframe src="${publicPath}" width="100%" height="800px" style="border: none;"></iframe>`
        });
      }
      // 4. md 파일은 원래 마지막에 .md를 안붙여서 동작
      else {
        try {
          // const postData = await getPostData(trimPublicPath);
          const found = await getPostByUniqueKeyword(trimBlogPath);
          if (!found) {
            newChildren.push({type: 'text', value: `[Error: Could not find ${trimBlogPath}]`});
            continue;
          }
          const postData = await getPostData(found.slug);

          let resultHtml = postData?.content || `[Error: Could not find ${trimBlogPath}]`;
          if (header) {
            const headerRegex = new RegExp(`(^|\\n)##*\\s+${header}\\s*\\n([\\s\\S]*?)(?=\\n##*|$)`);
            const headerMatch = postData?.markdownContent.match(headerRegex);
            // headerMatch[0] 는 전체 매치, headerMatch[1] 은 헤더, headerMatch[2] 는 내용
            const fileContent = headerMatch ? headerMatch[0].trim() : `[Error: Header "${header}" not found in ${trimBlogPath}]`;
            const {contentHtml} = await markdownToHtml(fileContent);
            resultHtml = contentHtml;
          }

          // 처리된 HTML을 'html' 노드로 추가합니다.
          newChildren.push({
            type : 'html',
            value: resultHtml
          });

        } catch (e) {
          console.error(`Error embedding markdown file: ${trimPublicPath}`, e);
          newChildren.push({type: 'text', value: `[Error: Could not embed ${trimPublicPath}]`});
        }
      }

      lastIndex = embedRegex.lastIndex;
    }


    /////////////////////////////////////////////////

    if (lastIndex < node.value.length) {
      newChildren.push({type: 'text', value: node.value.slice(lastIndex)});
    }

    if (newChildren.length > 0) {
      changes.push(() => {
        parent.children.splice(index, 1, ...newChildren);
      });
    }
  };
}

function textToWikiLinks(
  node: Text,
  baseBlogPathToTrim: string,
  repositoryName: string,
  baseRoute: string,
  changes: (() => void)[],
  parent: Parent,
  index: number
) {
  return async () => {
    /////////////이 부분부터 내부 로직 처리/////////////////

    const wikiLinkRegex = /(?<!!)\[\[([^\]]+)\]\]/g;
    if (!wikiLinkRegex.test(node.value)) return;

    const newChildren: (Text | Link)[] = [];
    let lastIndex = 0;
    let match;

    wikiLinkRegex.lastIndex = 0; // 정규식의 lastIndex를 초기화해야 합니다.
    while ((match = wikiLinkRegex.exec(node.value)) !== null) {
      if (match.index > lastIndex) {
        newChildren.push({type: 'text', value: node.value.slice(lastIndex, match.index)});
      }

      const {path: oriPath, header, alias} = parseWikiLinks(match[0]);

      let trimmedPath = oriPath;
      if (baseBlogPathToTrim && trimmedPath.startsWith(baseBlogPathToTrim)) {
        trimmedPath = trimmedPath.slice(baseBlogPathToTrim.length);
      }

      // 1. await를 사용하여 비동기 함수의 결과를 기다립니다.
      const found = await findPostMetaDataByUniqueKeyword(trimmedPath);

      let href = '#';
      const linkText = alias || trimmedPath.split('/').pop() || trimmedPath;

      // 2. 이제 'found'는 Promise가 아닌 실제 PostMetadata 객체 또는 undefined입니다.
      if (found) {
        href = `/${repositoryName ? repositoryName + "/" : ""}${baseRoute}/${found.slugHash}`;
        if (header) href += `#${encodeURIComponent(header)}`;
      }

      newChildren.push({
        type    : 'link',
        url     : href,
        children: [{type: 'text', value: linkText}]
      });

      lastIndex = wikiLinkRegex.lastIndex;
    }

    /////////////////////////////////////////////////

    if (lastIndex < node.value.length) {
      newChildren.push({type: 'text', value: node.value.slice(lastIndex)});
    }

    if (newChildren.length > 0) {
      changes.push(() => {
        parent.children.splice(index, 1, ...newChildren);
      });
    }
  };
}

// 하이라이트 변환 함수
function textToHighlight(
  node: Text,
  changes: (() => void)[],
  parent: Parent,
  index: number
) {
  return async () => {
    const highlightRegex = /==([^=]+)==/g;
    if (!highlightRegex.test(node.value)) return;

    const newChildren: (Text | Html)[] = [];
    let lastIndex = 0;
    let match;

    highlightRegex.lastIndex = 0;
    while ((match = highlightRegex.exec(node.value)) !== null) {
      if (match.index > lastIndex) {
        newChildren.push({type: 'text', value: node.value.slice(lastIndex, match.index)});
      }
      newChildren.push({
        type : 'html',
        value: `<mark>${match[1]}</mark>`
      });
      lastIndex = highlightRegex.lastIndex;
    }
    if (lastIndex < node.value.length) {
      newChildren.push({type: 'text', value: node.value.slice(lastIndex)});
    }
    if (newChildren.length > 0) {
      changes.push(() => {
        parent.children.splice(index, 1, ...newChildren);
      });
    }
  };
}

// 헤더 레벨별 색상 정의
const HEADER_COLORS: { [key: number]: string } = {
  1: '#82AAFF', // Light Blue
  2: '#C3E88D', // Light Green
  3: '#C792EA', // Light Purple
  4: '#89DDFF', // Cyan
  5: '#FF5370', // Red/Pink
  6: '#F78C6C', // Orange
};

// 헤더 노드를 커스텀 HTML로 변환하는 함수
export function remarkCustomHeaders() {
  return (tree: Root) => {
    visit(tree, 'heading', (node: Heading, index?: number, parent?: Parent) => {
      if (!parent || typeof index !== 'number') return;

      const level = node.depth;
      const tagColor = '#F0C292';
      const headerColor = HEADER_COLORS[level] || HEADER_COLORS[6];

      // 헤더의 텍스트 내용을 추출
      const headerText = node.children.map(child => {
        if ('value' in child) return child.value;
        return '';
      }).join('');

      // 새로운 HTML 노어 생성
      const newHtmlNode: Html = {
        type : 'html',
        value: `<h${level} style="color: ${headerColor};">
                  <span style="font-size: initial; color: ${tagColor}; margin-right: 0.5em;">h${level}</span>
                  ${headerText}
                </h${level}>`
      };

      // 기존 헤더 노드를 새로운 HTML 노드로 교체
      parent.children.splice(index, 1, newHtmlNode);
    });
  };
}

/**
 * 텍스트 노드의 줄바꿈(\n, \r\n, \r)을 <br> 태그로 변환
 * @param node
 * @param changes
 * @param parent
 * @param index
 */
function textToLineBreak(
  node: Text,
  changes: (() => void)[],
  parent: Parent,
  index: number
) {
  return async () => {
    // \r?\n 또는 \r만 있는 경우도 체크
    if (
      typeof node.value !== 'string' ||
      !/(\r?\n|\r)/.test(node.value)
    ) return;

    const newChildren: (Text | Html)[] = [];
    const lines = node.value.split(/(\r?\n|\r)/);

    lines.forEach(line => {
      if (/(\r?\n|\r)/.test(line)) {
        // 줄바꿈 문자를 만나면 <br> 태그 추가
        newChildren.push({type: 'html', value: '<br>'});
      } else if (line) {
        // 텍스트가 있으면 text 노드로 추가
        newChildren.push({type: 'text', value: line});
      }
    });

    if (newChildren.length > 0) {
      changes.push(() => {
        // 기존 노드를 새로운 노드 배열로 교체
        parent.children.splice(index, 1, ...newChildren);
      });
    }
  };
}

// Callout 타입에 따른 설정 (아이콘은 Heroicons v1 사용)
const CALLOUT_CONFIG: { [key: string]: { icon: string; color: string; defaultTitle: string; } } = {
  note    : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-4V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" /></svg>`,
    color       : '41, 128, 185',
    defaultTitle: 'Note'
  },
  seealso : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>`,
    color       : '41, 128, 185',
    defaultTitle: 'See Also'
  },
  abstract: {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 1a1 1 0 00-1 1v1a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1H6zM6 9a1 1 0 011-1h8a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h8a1 1 0 100-2H7z" clip-rule="evenodd" /></svg>`,
    color       : '0, 184, 148',
    defaultTitle: 'Abstract'
  },
  info    : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg>`,
    color       : '0, 116, 217',
    defaultTitle: 'Info'
  },
  todo    : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`,
    color       : '0, 116, 217',
    defaultTitle: 'Todo'
  },
  tip     : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l.293.293a1 1 0 001.414-1.414l-3-3z" clip-rule="evenodd" /></svg>`,
    color       : '0, 184, 148',
    defaultTitle: 'Tip'
  },
  success : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`,
    color       : '0, 184, 148',
    defaultTitle: 'Success'
  },
  question: {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-1 1v1a1 1 0 102 0V8a1 1 0 00-1-1zm1 9a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" /></svg>`,
    color       : '243, 156, 18',
    defaultTitle: 'Question'
  },
  warning : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`,
    color       : '243, 156, 18',
    defaultTitle: 'Warning'
  },
  failure : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`,
    color       : '211, 84, 0',
    defaultTitle: 'Failure'
  },
  danger  : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>`,
    color       : '231, 76, 60',
    defaultTitle: 'Danger'
  },
  bug     : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`,
    color       : '231, 76, 60',
    defaultTitle: 'Bug'
  },
  example : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 1a1 1 0 00-1 1v1a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1H6zM6 9a1 1 0 011-1h8a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h8a1 1 0 100-2H7z" clip-rule="evenodd" /></svg>`,
    color       : '127, 140, 141',
    defaultTitle: 'Example'
  },
  quote   : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>`,
    color       : '155, 89, 182',
    defaultTitle: 'Quote'
  },
  cite    : {
    icon        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>`,
    color       : '155, 89, 182',
    defaultTitle: 'Cite'
  },
};
// 별칭 매핑
CALLOUT_CONFIG.summary = CALLOUT_CONFIG.tldr = CALLOUT_CONFIG.abstract;
CALLOUT_CONFIG.hint = CALLOUT_CONFIG.important = CALLOUT_CONFIG.tip;
CALLOUT_CONFIG.check = CALLOUT_CONFIG.done = CALLOUT_CONFIG.success;
CALLOUT_CONFIG.help = CALLOUT_CONFIG.faq = CALLOUT_CONFIG.question;
CALLOUT_CONFIG.caution = CALLOUT_CONFIG.attention = CALLOUT_CONFIG.warning;
CALLOUT_CONFIG.fail = CALLOUT_CONFIG.missing = CALLOUT_CONFIG.failure;
CALLOUT_CONFIG.error = CALLOUT_CONFIG.danger;


function blockquoteToCallOut(
  node: Blockquote,
  changes: (() => void)[],
  parent: Parent,
  index: number
) {
  return async () => {
    // node.type이 'blockquote'가 아니면 실행하지 않음 (타입 가드)
    if (!node.children.length) return;

    const firstParagraph = node.children[0];
    if (firstParagraph.type !== 'paragraph' || !firstParagraph.children.length) return;

    const firstText = firstParagraph.children[0];
    if (firstText.type !== 'text') return;

    // Named Capturing Group을 사용하지 않도록 정규식 수정
    const calloutRegex = /\[!([\w]+)\](?: (.+))?/;
    const match = firstText.value.match(calloutRegex);

    // match.groups 대신 인덱스로 접근
    if (!match || !match[1]) return;

    const type = match[1];
    const title = match[2]; // title은 없을 수 있음 (undefined)
    const config = CALLOUT_CONFIG[type.toLowerCase()];
    if (!config) return;

    // Callout 구문 ([!TYPE]...) 제거
    firstText.value = firstText.value.slice(match[0].length).trimStart();
    // Callout 구문 제거 후 첫 문단이 비었으면 해당 문단 노드 제거
    if (firstText.value.length === 0) {
      firstParagraph.children.shift();
      if (firstParagraph.children.length === 0) {
        node.children.shift();
      }
    }

    // Callout의 나머지 내용을 HTML로 변환
    // remark().use(remarkHtml) 대신 unified() 사용
    const contentHtml = unified()
      .use(remarkHtml)
      .stringify({type: 'root', children: node.children});

    const finalTitle = title || config.defaultTitle;
    const calloutHtml = `
<div class="callout" style="--callout-color: ${config.color};">
  <div class="callout-title">
    <div class="callout-icon">${config.icon}</div>
    <div class="callout-title-text">${finalTitle}</div>
  </div>
  <div class="callout-content">
    ${contentHtml}
  </div>
</div>`;

    changes.push(() => {
      const newNode: Html = {type: 'html', value: calloutHtml};
      parent.children.splice(index, 1, newNode);
    });
  };
}

// 언어별 아이콘 SVG 매핑 (Devicon 및 유사 스타일 아이콘 사용)
export const LANGUAGE_ICONS: { [key: string]: string } = {
  java            : `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><title>Java</title><path d="M 28.1875 0 C 30.9375 6.363281 18.328125 10.292969 17.15625 15.59375 C 16.082031 20.464844 24.648438 26.125 24.65625 26.125 C 23.355469 24.109375 22.398438 22.449219 21.09375 19.3125 C 18.886719 14.007813 34.535156 9.207031 28.1875 0 Z M 36.5625 8.8125 C 36.5625 8.8125 25.5 9.523438 24.9375 16.59375 C 24.6875 19.742188 27.847656 21.398438 27.9375 23.6875 C 28.011719 25.558594 26.0625 27.125 26.0625 27.125 C 26.0625 27.125 29.609375 26.449219 30.71875 23.59375 C 31.949219 20.425781 28.320313 18.285156 28.6875 15.75 C 29.039063 13.324219 36.5625 8.8125 36.5625 8.8125 Z M 19.1875 25.15625 C 19.1875 25.15625 9.0625 25.011719 9.0625 27.875 C 9.0625 30.867188 22.316406 31.089844 31.78125 29.25 C 31.78125 29.25 34.296875 27.519531 34.96875 26.875 C 28.765625 28.140625 14.625 28.28125 14.625 27.1875 C 14.625 26.179688 19.1875 25.15625 19.1875 25.15625 Z M 38.65625 25.15625 C 37.664063 25.234375 36.59375 25.617188 35.625 26.3125 C 37.90625 25.820313 39.84375 27.234375 39.84375 28.84375 C 39.84375 32.46875 34.59375 35.875 34.59375 35.875 C 34.59375 35.875 42.71875 34.953125 42.71875 29 C 42.71875 26.296875 40.839844 24.984375 38.65625 25.15625 Z M 16.75 30.71875 C 15.195313 30.71875 12.875 31.9375 12.875 33.09375 C 12.875 35.417969 24.5625 37.207031 33.21875 33.8125 L 30.21875 31.96875 C 24.351563 33.847656 13.546875 33.234375 16.75 30.71875 Z M 18.1875 35.9375 C 16.058594 35.9375 14.65625 37.222656 14.65625 38.1875 C 14.65625 41.171875 27.371094 41.472656 32.40625 38.4375 L 29.21875 36.40625 C 25.457031 37.996094 16.015625 38.238281 18.1875 35.9375 Z M 11.09375 38.625 C 7.625 38.554688 5.375 40.113281 5.375 41.40625 C 5.375 48.28125 40.875 47.964844 40.875 40.9375 C 40.875 39.769531 39.527344 39.203125 39.03125 38.9375 C 41.933594 45.65625 9.96875 45.121094 9.96875 41.15625 C 9.96875 40.253906 12.320313 39.390625 14.5 39.8125 L 12.65625 38.75 C 12.113281 38.667969 11.589844 38.636719 11.09375 38.625 Z M 44.625 43.25 C 39.226563 48.367188 25.546875 50.222656 11.78125 47.0625 C 25.542969 52.695313 44.558594 49.535156 44.625 43.25 Z"/></svg>`,
  javascript      : `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px"><title>JavaScript</title><path d="M 2.9941406 3 L 2.9941406 3.5 L 2.9941406 21 L 20.996094 21 L 20.996094 3 L 2.9941406 3 z M 3.9941406 4 L 19.996094 4 L 19.996094 20 L 3.9941406 20 L 3.9941406 4 z M 10.996094 10.992188 L 10.996094 16.859375 C 10.996094 17.793375 10.685172 18.074219 10.076172 18.074219 C 9.4381719 18.074219 8.9960781 17.674297 8.7050781 17.154297 L 7.1953125 18.072266 C 7.6323125 18.992266 8.7035 19.992188 10.1875 19.992188 C 11.8315 19.992187 12.996094 19.072344 12.996094 17.152344 L 12.996094 10.992188 L 10.996094 10.992188 z M 16.931641 10.994141 C 15.338641 10.994141 14.320312 12.033859 14.320312 13.380859 C 14.320312 14.860859 15.175891 15.553281 16.462891 16.113281 L 16.908203 16.300781 C 17.721203 16.660781 18.123047 16.888953 18.123047 17.501953 C 18.123047 17.941953 17.592094 18.193359 16.996094 18.193359 C 16.116094 18.193359 15.699359 17.794297 15.318359 17.154297 L 13.917969 18.101562 C 14.441969 19.154562 15.380109 19.994141 17.037109 19.994141 C 18.731109 19.994141 19.994141 19.101609 19.994141 17.474609 C 19.994141 15.967609 19.138094 15.301766 17.621094 14.634766 L 17.175781 14.447266 C 16.411781 14.114266 16.078125 13.886516 16.078125 13.353516 C 16.078125 12.913516 16.408641 12.580078 16.931641 12.580078 C 17.444641 12.580078 17.775078 12.793516 18.080078 13.353516 L 19.46875 12.447266 C 18.88275 11.394266 18.066641 10.994141 16.931641 10.994141 z"/></svg>`,
  js              : `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px"><title>JavaScript</title><path d="M 2.9941406 3 L 2.9941406 3.5 L 2.9941406 21 L 20.996094 21 L 20.996094 3 L 2.9941406 3 z M 3.9941406 4 L 19.996094 4 L 19.996094 20 L 3.9941406 20 L 3.9941406 4 z M 10.996094 10.992188 L 10.996094 16.859375 C 10.996094 17.793375 10.685172 18.074219 10.076172 18.074219 C 9.4381719 18.074219 8.9960781 17.674297 8.7050781 17.154297 L 7.1953125 18.072266 C 7.6323125 18.992266 8.7035 19.992188 10.1875 19.992188 C 11.8315 19.992187 12.996094 19.072344 12.996094 17.152344 L 12.996094 10.992188 L 10.996094 10.992188 z M 16.931641 10.994141 C 15.338641 10.994141 14.320312 12.033859 14.320312 13.380859 C 14.320312 14.860859 15.175891 15.553281 16.462891 16.113281 L 16.908203 16.300781 C 17.721203 16.660781 18.123047 16.888953 18.123047 17.501953 C 18.123047 17.941953 17.592094 18.193359 16.996094 18.193359 C 16.116094 18.193359 15.699359 17.794297 15.318359 17.154297 L 13.917969 18.101562 C 14.441969 19.154562 15.380109 19.994141 17.037109 19.994141 C 18.731109 19.994141 19.994141 19.101609 19.994141 17.474609 C 19.994141 15.967609 19.138094 15.301766 17.621094 14.634766 L 17.175781 14.447266 C 16.411781 14.114266 16.078125 13.886516 16.078125 13.353516 C 16.078125 12.913516 16.408641 12.580078 16.931641 12.580078 C 17.444641 12.580078 17.775078 12.793516 18.080078 13.353516 L 19.46875 12.447266 C 18.88275 11.394266 18.066641 10.994141 16.931641 10.994141 z"/></svg>`,
  typescript      : `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><title>TypeScript</title><path d="M 5 4 A 1.0001 1.0001 0 0 0 4 5 L 4 45 A 1.0001 1.0001 0 0 0 5 46 L 45 46 A 1.0001 1.0001 0 0 0 46 45 L 46 5 A 1.0001 1.0001 0 0 0 45 4 L 5 4 z M 6 6 L 44 6 L 44 44 L 6 44 L 6 6 z M 15 23 L 15 26.445312 L 20 26.445312 L 20 42 L 24 42 L 24 26.445312 L 29 26.445312 L 29 23 L 15 23 z M 36.691406 23.009766 C 33.576782 22.997369 30.017578 23.941219 30.017578 28.324219 C 30.017578 34.054219 37.738281 34.055625 37.738281 36.640625 C 37.738281 36.885625 37.842187 38.666016 35.117188 38.666016 C 32.392187 38.666016 30.121094 36.953125 30.121094 36.953125 L 30.121094 41.111328 C 30.121094 41.111328 42.001953 44.954062 42.001953 36.289062 C 42.000953 30.664063 34.208984 30.945391 34.208984 28.150391 C 34.208984 27.067391 34.978375 26.054687 37.109375 26.054688 C 39.240375 26.054688 41.126953 27.3125 41.126953 27.3125 L 41.267578 23.607422 C 41.267578 23.607422 39.113892 23.019408 36.691406 23.009766 z"/></svg>`,
  ts              : `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px"><title>TypeScript</title><path d="M 5 4 A 1.0001 1.0001 0 0 0 4 5 L 4 45 A 1.0001 1.0001 0 0 0 5 46 L 45 46 A 1.0001 1.0001 0 0 0 46 45 L 46 5 A 1.0001 1.0001 0 0 0 45 4 L 5 4 z M 6 6 L 44 6 L 44 44 L 6 44 L 6 6 z M 15 23 L 15 26.445312 L 20 26.445312 L 20 42 L 24 42 L 24 26.445312 L 29 26.445312 L 29 23 L 15 23 z M 36.691406 23.009766 C 33.576782 22.997369 30.017578 23.941219 30.017578 28.324219 C 30.017578 34.054219 37.738281 34.055625 37.738281 36.640625 C 37.738281 36.885625 37.842187 38.666016 35.117188 38.666016 C 32.392187 38.666016 30.121094 36.953125 30.121094 36.953125 L 30.121094 41.111328 C 30.121094 41.111328 42.001953 44.954062 42.001953 36.289062 C 42.000953 30.664063 34.208984 30.945391 34.208984 28.150391 C 34.208984 27.067391 34.978375 26.054687 37.109375 26.054688 C 39.240375 26.054688 41.126953 27.3125 41.126953 27.3125 L 41.267578 23.607422 C 41.267578 23.607422 39.113892 23.019408 36.691406 23.009766 z"/></svg>`,
  gradle          : `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><title>Gradle</title><path d="M22.695 4.297a3.807 3.807 0 0 0 -5.29 -0.09 0.368 0.368 0 0 0 0 0.533l0.46 0.47a0.363 0.363 0 0 0 0.474 0.032 2.182 2.182 0 0 1 2.86 3.291c-3.023 3.02 -7.056 -5.447 -16.211 -1.083a1.24 1.24 0 0 0 -0.534 1.745l1.571 2.713a1.238 1.238 0 0 0 1.681 0.461l0.037 -0.02 -0.029 0.02 0.688 -0.384a16.083 16.083 0 0 0 2.193 -1.635 0.384 0.384 0 0 1 0.499 -0.016 0.357 0.357 0 0 1 0.016 0.534 16.435 16.435 0 0 1 -2.316 1.741H8.77l-0.696 0.39a1.958 1.958 0 0 1 -0.963 0.25 1.987 1.987 0 0 1 -1.726 -0.989L3.9 9.696C1.06 11.72 -0.686 15.603 0.26 20.522a0.363 0.363 0 0 0 0.354 0.296h1.675a0.363 0.363 0 0 0 0.37 -0.331 2.478 2.478 0 0 1 4.915 0 0.36 0.36 0 0 0 0.357 0.317h1.638a0.363 0.363 0 0 0 0.357 -0.317 2.478 2.478 0 0 1 4.914 0 0.363 0.363 0 0 0 0.358 0.317h1.627a0.363 0.363 0 0 0 0.363 -0.357c0.037 -2.294 0.656 -4.93 2.42 -6.25 6.108 -4.57 4.502 -8.486 3.088 -9.9zm-6.229 6.901 -1.165 -0.584a0.73 0.73 0 1 1 1.165 0.587z" stroke-width="1"></path></svg>`,
  plantuml        : `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><defs><linearGradient id="a" x1="-33.423" y1="-250.911" x2="-33.353" y2="-250.858" gradientTransform="matrix(37.134, 26.001, 13.575, -19.387, 4673.473, -3982.019)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#767676"/><stop offset="1"/></linearGradient><linearGradient id="b" x1="-32.107" y1="-242.563" x2="-32.028" y2="-242.586" gradientTransform="matrix(81.081, 56.774, 17.306, -24.715, 6804.021, -4149.644)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0079b9"/><stop offset="1"/></linearGradient><linearGradient id="c" x1="-33.282" y1="-243.423" x2="-33.224" y2="-243.455" gradientTransform="matrix(60.003, 42.015, 34.184, -48.82, 10343.005, -10469.084)" xlink:href="#b"/><linearGradient id="d" x1="12.356" y1="26.268" x2="14.011" y2="26.268" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#595959"/><stop offset="0.087" stop-color="#6e6e6e"/><stop offset="0.242" stop-color="#8c8c8c"/><stop offset="0.405" stop-color="#a4a4a4"/><stop offset="0.577" stop-color="#b5b5b5"/><stop offset="0.765" stop-color="#bfbfbf"/><stop offset="1" stop-color="#c2c2c2"/></linearGradient><linearGradient id="e" x1="18.291" y1="26.171" x2="19.946" y2="26.171" xlink:href="#d"/><linearGradient id="f" x1="24.44" y1="26.171" x2="26.096" y2="26.171" xlink:href="#d"/></defs><title>file_type_plantuml</title><polygon points="20.305 17.872 27.16 22.418 21.72 25.493 14.861 20.999 20.305 17.872" style="fill:#1c0a42"/><path d="M21.716,25.619l-.055-.036-7.005-4.59,5.653-3.247,7.056,4.68Zm-6.65-4.613,6.658,4.362,5.231-2.957L20.3,18Z"/><polygon points="26.401 11.909 29.418 13.592 27.07 15.088 24.213 13.247 26.401 11.909" style="fill:url(#a)"/><path d="M27.069,15.215l-3.058-1.97,2.387-1.46,3.228,1.8Zm-2.654-1.966L27.07,14.96,29.208,13.6l-2.8-1.565Z"/><polygon points="14.498 17.807 21.354 22.354 15.914 25.429 9.055 20.935 14.498 17.807" style="fill:#ffbd3f"/><path d="M15.91,25.554l-.055-.036L8.85,20.929,14.5,17.681l7.056,4.68ZM9.26,20.941,15.918,25.3l5.231-2.957-6.654-4.413Z"/><polygon points="7.99 17.966 14.954 22.366 9.577 25.504 2.218 20.849 7.99 17.966" style="fill:#a11f40"/><path d="M9.575,25.629,2,20.838l6-3,7.164,4.527ZM2.436,20.86,9.58,25.378l5.168-3.016L7.984,18.089Z"/><polygon points="2.111 21.021 9.443 25.515 9.443 29.063 2.111 24.332 2.111 21.021" style="fill:url(#b)"/><path d="M9.55,29.26,2,24.391V20.829L9.55,25.455ZM2.218,24.274l7.118,4.592V25.575L2.218,21.213Z"/><polygon points="24.071 13.343 27.009 15.222 27.009 22.131 24.071 20.247 24.071 13.343" style="fill:url(#c)"/><path d="M27.063,22.229l-3.045-1.953V13.245l3.045,1.947Zm-2.938-2.012,2.831,1.815V15.251l-2.831-1.81Z"/><polygon points="27.149 22.526 27.149 15.194 29.514 13.775 29.514 29.149 28.331 29.149 9.646 29.149 9.646 25.601 15.086 22.526 15.785 25.601 15.796 25.601 21.472 22.526 21.891 25.601 21.945 25.601 27.149 22.526" style="fill:#fff"/><path d="M29.621,29.256H9.539V25.538l5.62-3.177.7,3.083,5.7-3.087.422,3.1,5.061-2.991V15.133l2.58-1.548ZM9.753,29.041H29.407V13.964l-2.151,1.29v7.332l-.053.031-5.229,3.09H21.8l-.411-3.014-5.564,3.014H15.7l-.686-3.018-5.26,2.973Z"/><rect x="12.356" y="25.44" width="1.656" height="1.656" rx="0.215" ry="0.215" style="fill:url(#d)"/><path d="M13.8,27.2H12.57a.322.322,0,0,1-.322-.322V25.655a.322.322,0,0,1,.322-.322H13.8a.322.322,0,0,1,.322.322v1.226A.322.322,0,0,1,13.8,27.2ZM12.57,25.547a.108.108,0,0,0-.107.107v1.226a.108.108,0,0,0,.107.107H13.8a.108.108,0,0,0,.107-.107V25.655a.108.108,0,0,0-.107-.107Z"/><rect x="18.291" y="25.343" width="1.656" height="1.656" rx="0.215" ry="0.215" style="fill:url(#e)"/><path d="M19.732,27.106H18.505a.322.322,0,0,1-.322-.322V25.558a.322.322,0,0,1,.322-.322h1.226a.322.322,0,0,1,.322.322v1.226A.322.322,0,0,1,19.732,27.106Zm-1.226-1.656a.108.108,0,0,0-.107.107v1.226a.108.108,0,0,0,.107.107h1.226a.108.108,0,0,0,.107-.107V25.558a.108.108,0,0,0-.107-.107Z"/><rect x="24.44" y="25.343" width="1.656" height="1.656" rx="0.215" ry="0.215" style="fill:url(#f)"/><path d="M25.881,27.106H24.655a.322.322,0,0,1-.322-.322V25.558a.322.322,0,0,1,.322-.322h1.226a.322.322,0,0,1,.322.322v1.226A.322.322,0,0,1,25.881,27.106Zm-1.226-1.656a.108.108,0,0,0-.107.107v1.226a.108.108,0,0,0,.107.107h1.226a.108.108,0,0,0,.107-.107V25.558a.108.108,0,0,0-.107-.107Z"/><path d="M27.215,11.23c-.052.069-.417-.262-.653-.526a4.408,4.408,0,0,1-.516-.73A2.6,2.6,0,0,1,25.7,9.2a2.358,2.358,0,0,1-.052-.682,2.959,2.959,0,0,1,.129-.749,3.142,3.142,0,0,1,.787-1.207,15.532,15.532,0,0,0,1.283-1.4,3.062,3.062,0,0,0,.479-.927,3.979,3.979,0,0,0,.151-.855c.019-.364-.025-.593.023-.613s.215.274.287.564a3.167,3.167,0,0,1-.458,2.1,6.9,6.9,0,0,1-1.094,1.448,2.8,2.8,0,0,0-.849,1.234A2.466,2.466,0,0,0,26.3,8.8a3.465,3.465,0,0,0,.476,1.542C27.064,10.914,27.256,11.175,27.215,11.23Z" style="fill:#ea2d2e"/><path d="M27.193,11.266c-.124,0-.492-.365-.651-.544a4.478,4.478,0,0,1-.52-.734,2.628,2.628,0,0,1-.346-.781,2.375,2.375,0,0,1-.053-.69,2.978,2.978,0,0,1,.13-.756,3.208,3.208,0,0,1,.793-1.216c.294-.331.5-.528.659-.686a4.393,4.393,0,0,0,.622-.711,3.052,3.052,0,0,0,.476-.919,3.951,3.951,0,0,0,.15-.849c.008-.159,0-.294,0-.393,0-.159-.006-.225.038-.243a.05.05,0,0,1,.043,0,1.226,1.226,0,0,1,.28.579,3.167,3.167,0,0,1-.46,2.121,6.928,6.928,0,0,1-1.1,1.453c-.055.06-.109.116-.162.171a2.3,2.3,0,0,0-.681,1.052,2.47,2.47,0,0,0-.082.673,3.458,3.458,0,0,0,.473,1.53c.114.231.215.415.289.549.129.235.178.323.142.369h0a.051.051,0,0,1-.04.02ZM28.512,2.8a.863.863,0,0,0,0,.19c0,.1.007.236,0,.4a4.021,4.021,0,0,1-.152.861,3.106,3.106,0,0,1-.483.934,4.437,4.437,0,0,1-.629.719c-.162.158-.364.354-.657.683a3.168,3.168,0,0,0-.782,1.2,2.933,2.933,0,0,0-.128.743,2.325,2.325,0,0,0,.052.675,2.59,2.59,0,0,0,.341.767,4.422,4.422,0,0,0,.513.725,2.035,2.035,0,0,0,.611.526,1.183,1.183,0,0,0-.147-.31c-.074-.134-.175-.318-.29-.551A3.5,3.5,0,0,1,26.278,8.8a2.53,2.53,0,0,1,.084-.688,2.375,2.375,0,0,1,.694-1.075c.052-.055.106-.111.161-.171a6.879,6.879,0,0,0,1.09-1.442,3.119,3.119,0,0,0,.456-2.083A1.281,1.281,0,0,0,28.512,2.8Z"/><path d="M29.972,6.087c-.019-.088-.432-.04-.766.073a2.6,2.6,0,0,0-1.059.722,2.8,2.8,0,0,0-.916,1.855,2.972,2.972,0,0,0,.258,1.06c.221.572.455.773.444,1.225-.007.3-.114.484-.048.549s.314-.1.462-.313a1.8,1.8,0,0,0,.259-1.022c-.046-.815-.6-1.015-.608-1.8a1.858,1.858,0,0,1,.129-.676C28.57,6.509,30.008,6.252,29.972,6.087Z" style="fill:#ea2d2e"/><path d="M27.934,11.617a.094.094,0,0,1-.069-.026c-.046-.046-.03-.122-.005-.237a1.718,1.718,0,0,0,.045-.331,1.374,1.374,0,0,0-.214-.72,5,5,0,0,1-.228-.495,2.98,2.98,0,0,1-.259-1.07,2.81,2.81,0,0,1,.923-1.874,2.64,2.64,0,0,1,1.07-.729,1.482,1.482,0,0,1,.766-.1A.065.065,0,0,1,30,6.081h0c.015.07-.092.121-.306.224a2.73,2.73,0,0,0-1.542,1.463,1.827,1.827,0,0,0-.127.667,1.645,1.645,0,0,0,.291.885,1.889,1.889,0,0,1,.317.914,1.814,1.814,0,0,1-.264,1.039.809.809,0,0,1-.421.342Zm1.889-5.549a2.117,2.117,0,0,0-.608.117,2.588,2.588,0,0,0-1.048.715,2.764,2.764,0,0,0-.909,1.837,2.935,2.935,0,0,0,.256,1.05,4.955,4.955,0,0,0,.225.49,1.433,1.433,0,0,1,.22.745,1.765,1.765,0,0,1-.047.341c-.019.091-.035.163-.009.188a.046.046,0,0,0,.038.01.769.769,0,0,0,.382-.32,1.793,1.793,0,0,0,.254-1.005,1.844,1.844,0,0,0-.31-.89,1.711,1.711,0,0,1-.3-.911,1.877,1.877,0,0,1,.13-.686A2.776,2.776,0,0,1,29.67,6.257c.126-.061.283-.136.277-.164l-.008-.007A.264.264,0,0,0,29.823,6.068Z"/></svg>`,
  sh              : `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Shell Script</title><path d="M4.2 3L3 4.2l4.4 4.4L3 13.2l1.2 1.2L12 7.8l-7.8-4.8m5.6 12.6H21v-1.8H9.8v1.8Z"/></svg>`,
  bat             : `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Batch</title><path d="M2 5v14h20V5H2zm18 12H4V7h16v10zM6 9h2v2H6V9zm3 0h8v2H9V9zm0 3h6v2H9v-2z"/></svg>`,
  xml             : `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>XML</title><path d="M13.4 3l-2.8 18 2.8 0 2.8-18h-2.8zM6.4 6l-3.8 6 3.8 6 2.2 0-3.8-6 3.8-6-2.2 0zM21.4 6l-3.8 6 3.8 6 2.2 0-3.8-6 3.8-6-2.2 0z"/></svg>`,
  python          : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 96 96" id="Python--Streamline-Svg-Logos" height="24" width="24"><title>Python</title><path fill="url(#a)" d="M47.6611 1.24463c-23.863 0-22.3728 10.34847-22.3728 10.34847l.0266 10.7209h22.7719v3.2189H16.27S1 23.8011 1 47.8792c-.000002 24.078 13.328 23.2241 13.328 23.2241h7.9542V59.9302s-.4288-13.328 13.1151-13.328H57.983s12.6895.2052 12.6895-12.2638V13.7213S72.5991 1.24463 47.6611 1.24463ZM35.1047 8.45396c2.2656 0 4.0968 1.83114 4.0968 4.09684 0 2.2656-1.8312 4.0968-4.0968 4.0968-2.2657 0-4.0968-1.8312-4.0968-4.0968 0-2.2657 1.8311-4.09684 4.0968-4.09684Z"></path><path fill="url(#b)" d="M48.3393 94.7555c23.8631 0 22.3729-10.3484 22.3729-10.3484l-.0266-10.7209H47.9137v-3.2189h31.8168s15.27 1.7317 15.27-22.3463-13.328-23.2242-13.328-23.2242h-7.9542v11.1731s.4288 13.328-13.1151 13.328H38.0175S25.328 49.1928 25.328 61.6618v20.6171s-1.9267 12.4766 23.0113 12.4766Zm12.5565-7.2093c-2.2657 0-4.0968-1.8312-4.0968-4.0968 0-2.2657 1.8311-4.0968 4.0968-4.0968 2.2656 0 4.0968 1.8311 4.0968 4.0968 0 2.2656-1.8312 4.0968-4.0968 4.0968Z"></path><defs><linearGradient id="a" x1="904.358" x2="5562.66" y1="842.346" y2="5454.17" gradientUnits="userSpaceOnUse"><stop stop-color="#387eb8"></stop><stop offset="1" stop-color="#366994"></stop></linearGradient><linearGradient id="b" x1="1358.62" x2="6361.13" y1="1462.61" y2="6191.63" gradientUnits="userSpaceOnUse"><stop stop-color="#ffe052"></stop><stop offset="1" stop-color="#ffc331"></stop></linearGradient></defs></svg>`,
  json            : `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>JSON</title><path d="M1.59 2.085c-.51.345-.84 1.005-.84 1.665v16.5c0 .66.33 1.32.84 1.665.51.345 1.155.345 1.665 0l1.68-1.11c.345-.225.555-.615.555-1.02V4.215c0-.405-.21-.81-.555-1.02l-1.68-1.11c-.51-.345-1.155-.345-1.665 0zm20.82 0c-.51.345-1.155-.345-1.665 0l-1.68 1.11c-.345-.225-.555-.615-.555 1.02v15.45c0 .405.21.81.555 1.02l1.68 1.11c.51.345 1.155.345 1.665 0 .51-.345.84-1.005.84-1.665V3.75c0-.66-.33-1.32-.84-1.665zM9 15.75c0 1.245.99 2.25 2.25 2.25S13.5 17.01 13.5 15.75s-.99-2.25-2.25-2.25-2.25.99-2.25 2.25zm6 0c0 1.245.99 2.25 2.25 2.25s2.25-.99 2.25-2.25-.99-2.25-2.25-2.25-2.25.99-2.25 2.25z"/></svg>`,
  docker          : `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Docker</title><path d="M23.215 9.334c-.32-.18-.71-.205-1.065-.065l-1.12 1.295h-2.28v-2.28h1.295c.355 0 .68-.14.92-.385.24-.24.38-.56.38-.92V6.01c0-.35-.14-.68-.38-.92a1.29 1.29 0 0 0-.92-.38H1.29C.58 4.71 0 5.29 0 6.01v1.265c0 .355.14.68.38.92.24.24.56.38.92.38h1.29v2.28H1.3c-.355 0-.68.14-.92.38-.24.24-.38.56-.38.92v1.26c0 .36.14.685.38.925.24.24.565.38.92.38h2.28v2.28H1.3c-.355 0-.68.14-.92.38-.24.24-.38.56-.38.92v1.26c0 .72.58 1.29 1.29 1.29h16.23c.36 0 .68-.14.92-.38.24-.24.38-.56.38-.92v-1.26c0-.36-.14-.68-.38-.92a1.29 1.29 0 0 0-.92-.38h-2.28v-2.28h2.28c.355 0 .68-.14.92-.38.24-.24.38-.56.38-.92v-1.26c0-.36-.14-.685-.38-.925a1.29 1.29 0 0 0-.92-.38h-1.12l1.12-1.29a.81.81 0 0 0 .245-.52.81.81 0 0 0-.18-.55zM7.42 17.49H4.86v-2.56h2.56v2.56zm0-3.84H4.86v-2.56h2.56v2.56zm0-3.84H4.86V7.25h2.56v2.56zm3.84 7.68h-2.56v-2.56h2.56v2.56zm0-3.84h-2.56v-2.56h2.56v2.56zm0-3.84h-2.56V7.25h2.56v2.56zm3.84 7.68h-2.56v-2.56h2.56v2.56zm0-3.84h-2.56v-2.56h2.56v2.56zm3.84 3.84h-2.56v-2.56h2.56v2.56z"/></svg>`,
  'docker-compose': `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Docker</title><path d="M23.215 9.334c-.32-.18-.71-.205-1.065-.065l-1.12 1.295h-2.28v-2.28h1.295c.355 0 .68-.14.92-.385.24-.24.38-.56.38-.92V6.01c0-.35-.14-.68-.38-.92a1.29 1.29 0 0 0-.92-.38H1.29C.58 4.71 0 5.29 0 6.01v1.265c0 .355.14.68.38.92.24.24.56.38.92.38h1.29v2.28H1.3c-.355 0-.68.14-.92.38-.24.24-.38.56-.38.92v1.26c0 .36.14.685.38.925.24.24.565.38.92.38h2.28v2.28H1.3c-.355 0-.68.14-.92.38-.24.24-.38.56-.38.92v1.26c0 .72.58 1.29 1.29 1.29h16.23c.36 0 .68-.14.92-.38.24-.24.38-.56.38-.92v-1.26c0-.36-.14-.68-.38-.92a1.29 1.29 0 0 0-.92-.38h-2.28v-2.28h2.28c.355 0 .68-.14.92-.38.24-.24.38-.56.38-.92v-1.26c0-.36-.14-.685-.38-.925a1.29 1.29 0 0 0-.92-.38h-1.12l1.12-1.29a.81.81 0 0 0 .245-.52.81.81 0 0 0-.18-.55zM7.42 17.49H4.86v-2.56h2.56v2.56zm0-3.84H4.86v-2.56h2.56v2.56zm0-3.84H4.86V7.25h2.56v2.56zm3.84 7.68h-2.56v-2.56h2.56v2.56zm0-3.84h-2.56v-2.56h2.56v2.56zm0-3.84h-2.56V7.25h2.56v2.56zm3.84 7.68h-2.56v-2.56h2.56v2.56zm0-3.84h-2.56v-2.56h2.56v2.56zm3.84 3.84h-2.56v-2.56h2.56v2.56z"/></svg>`,
  sql             : `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>SQL</title><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V9h2v3zm0-5H9V5h2v2zm4 9h-2V5h2v11z"/></svg>`,
  yml             : `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>YAML</title><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15H9v-2h2v2zm0-4H9V9h2v4zm0-6H9V5h2v2zm4 6h-2V9h2v4zm0-6h-2V5h2v2zm4 6h-2V9h2v4z"/></svg>`,
  md              : `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Markdown</title><path d="M20.7 6.3H3.3c-.4 0-.7.3-.7.7v10c0 .4.3.7.7.7h17.3c.4 0 .7-.3.7-.7V7c0-.4-.3-.7-.7-.7zM12 15.4l-3-3h2.2V9.8h1.5v2.6H15l-3 3zM5.4 10.2h1.5v3.6H5.4v-3.6zm13.2-1.7l-1.5 1.7-1.5-1.7h-1.5v5.1h1.5v-2.6l1.5 1.7 1.5-1.7v2.6h1.5V8.5h-1.5z"/></svg>`,
};


export function remarkInlineCode() {
  return (tree: Root) => {
    visit(tree, 'inlineCode', (node: InlineCode, index?: number, parent?: Parent) => {
      if (!parent || typeof index !== 'number' || !node.value.startsWith('{')) {
        return;
      }

      const endMetaIndex = node.value.indexOf('}');
      if (endMetaIndex === -1) {
        return;
      }

      const meta = node.value.substring(1, endMetaIndex).trim();
      const code = node.value.substring(endMetaIndex + 1).trim();

      if (!meta) return;

      const langMatch = meta.match(/^\s*(\w+)/);
      const lang = langMatch ? langMatch[1] : '';
      const restMeta = langMatch ? meta.substring(langMatch[0].length).trim() : meta;

      const hasIcon = /\bicon\b/.test(restMeta);
      const titleMatch = restMeta.match(/title:"([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : '';

      const iconSvg = hasIcon ? (LANGUAGE_ICONS[lang.toLowerCase()] || '') : '';
      const icon = iconSvg.includes('xmlns=') ? iconSvg : iconSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

      const escapeHtml = (str: string) => {
        return str.replace(/[&<>\"']/g, (match) => {
          switch (match) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#39;';
            default: return match;
          }
        });
      };

      // 1. highlight.js를 사용하여 코드 하이라이팅
      let highlightedCode: string;
      try {
        // 언어가 유효하고 highlight.js에서 지원하는 경우
        if (lang && hljs.getLanguage(lang)) {
          highlightedCode = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
        } else {
          // 언어가 없거나 지원되지 않으면 자동 감지
          highlightedCode = hljs.highlightAuto(code).value;
        }
      } catch {
        // 오류 발생 시 이스케이프 처리된 일반 텍스트로 대체
        highlightedCode = escapeHtml(code);
      }

      const titleHtml = (icon || title)
        ? `<span class="custom-inline-code-title">${icon ? `<span class="custom-inline-code-icon">${icon}</span>` : ''}${title ? `<span class="custom-inline-code-title-text">${escapeHtml(title)}</span>` : ''}</span>`
        : '';

      // 2. 하이라이팅된 HTML을 code 태그에 삽입
      // language-* 클래스 대신 highlight.js 테마가 적용될 수 있는 hljs 클래스 사용
      const codeHtml = `<code class="hljs ${lang}">${highlightedCode}</code>`;

      const newNode: Html = {
        type: 'html',
        value: `<span class="custom-inline-code">${titleHtml}${codeHtml}</span>`
      };

      parent.children.splice(index, 1, newNode);
    });
  };
}




///////////////////////////////////codeblock test Start//////////////////////////////////////
export function remarkCodeBlock() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code, index?: number, parent?: Parent) => {
      if (!parent || typeof index !== 'number') return;

      const lang = node.lang || 'text';
      const meta = node.meta || '';

      // 1. 메타 정보 파싱
      const titleMatch = meta.match(/title:"([^"]+)"/);
      const title = titleMatch ? titleMatch[1] : '';

      let contentHtml: string;

      if (lang === 'plantuml') {
        const encoded = `~1${encodePuml(node.value)}`;
        const escapeHtml = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        contentHtml = `
          <div class="plantuml-diagram-container">
            <img src="http://www.plantuml.com/plantuml/svg/${encoded}" alt="PlantUML Diagram" />
            <code style="display: none;">${escapeHtml(node.value)}</code>
          </div>
        `;
      } else {
        const hlMatch = meta.match(/hl:((?:\d+(?:-\d+)?|'[^']+'|"[^"]+"|\/[^\/]+\/[igmsuy]*)(?:,(?:\d+(?:-\d+)?|'[^']+'|"[^"]+"|\/[^\/]+\/[igmsuy]*))*)/);
        const hlRules = hlMatch ? hlMatch[1] : '';

        const codeLines = node.value.split('\n');
        const linesToHighlight = new Set<number>();

        // 2. 하이라이트할 라인 계산
        if (hlRules) {
          const rules = hlRules.split(',').map(r => r.trim());
          rules.forEach(rule => {
            // 범위 (e.g., 1-3)
            if (/^\d+-\d+$/.test(rule)) {
              const [start, end] = rule.split('-').map(Number);
              for (let i = start; i <= end; i++) {
                linesToHighlight.add(i);
              }
            }
            // 단일 숫자 (e.g., 1)
            else if (/^\d+$/.test(rule)) {
              linesToHighlight.add(Number(rule));
            }
            // 텍스트 (e.g., 'foo' or "bar")
            else if (rule.startsWith("'") && rule.endsWith("'") || rule.startsWith('"') && rule.endsWith('"')) {
              const searchText = rule.substring(1, rule.length - 1);
              codeLines.forEach((line, i) => {
                if (line.includes(searchText)) {
                  linesToHighlight.add(i + 1);
                }
              });
            }
            // 정규식 (e.g., /#\w{6}/)
            else if (rule.startsWith('/') && rule.lastIndexOf('/') > 0) {
              const lastSlash = rule.lastIndexOf('/');
              const pattern = rule.substring(1, lastSlash);
              const flags = rule.substring(lastSlash + 1);
              try {
                const regex = new RegExp(pattern, flags);
                codeLines.forEach((line, i) => {
                  if (regex.test(line)) {
                    linesToHighlight.add(i + 1);
                  }
                });
              } catch (e) {
                console.error('Invalid regex in code block meta:', rule, e);
              }
            }
          });
        }

        // 3. highlight.js로 코드 하이라이팅
        let highlightedCode: string;
        try {
          if (lang && hljs.getLanguage(lang)) {
            highlightedCode = hljs.highlight(node.value, { language: lang }).value;
          } else {
            highlightedCode = hljs.highlightAuto(node.value).value;
          }
        } catch {
          highlightedCode = node.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }

        // 4. 하이라이트 라인 적용
        const highlightedLines = highlightedCode.split('\n').map((line, i) => {
          // 각 라인을 span으로 감싸서 display:block을 적용할 수 있도록 하고,
          // 빈 라인도 높이를 가질 수 있도록 &nbsp;를 추가합니다.
          const lineContent = line || '&nbsp;';
          if (linesToHighlight.has(i + 1)) {
            return `<span class="line highlighted-line">${lineContent}</span>`;
          }
          return `<span class="line">${lineContent}</span>`;
        }).join('');

        contentHtml = `<pre><code class="language-${lang} hljs">${highlightedLines}</code></pre>`;
      }

      // 5. 최종 HTML 생성
      const iconSvg = LANGUAGE_ICONS[lang.toLowerCase()] || '';
      const icon = iconSvg.includes('xmlns=') ? iconSvg : iconSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

      const headerHtml = `
        <div class="custom-code-block-header">
          <div class="custom-code-block-header-left">
            <div class="custom-code-block-lang">
              ${icon ? `<span class="custom-code-block-icon">${icon}</span>` : ''}
              <span class="custom-code-block-lang-text">${lang}</span>
            </div>
            ${title ? `<span class="custom-code-block-title">${title}</span>` : ''}
          </div>
          <div class="custom-code-block-header-right">
            <div class="custom-code-block-actions">
              <button class="copy-code-button" title="Copy code">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
          </div>
        </div>
      `;

      const finalHtml = `
        <div class="custom-code-block">
          ${headerHtml}
          ${contentHtml}
        </div>
      `;

      const newNode: Html = { type: 'html', value: finalHtml };
      parent.children.splice(index, 1, newNode);
    });
  };
}

//////////////////////////////////codeblock test end/////////////////////////////////////////

/**
 * 아직 분석되지 않은 부분을 변환
 * @param options {
 *   repositoryName?: string, // 리포지토리 이름 (옵션)
 *   baseRoute?: string, // 기본 라우트 (옵션, 기본값: "blog")
 *   basePublic?: string, // 기본 공개 경로 (옵션, 기본값: "images")
 *   baseBlogPathToTrim?: string, // 블로그 경로에서 제거할 기본 경로 (옵션, 기본값: "2.Ref(데이터 및 정보 저장)/")
 *   basePublicPathToTrim?: string // 공개 경로에서 제거할 기본 경로 (옵션, 기본값: "config/")
 * }
 */
export function remarkText(options: {
  repositoryName?: string,
  baseRoute?: string,
  basePublic?: string,
  baseBlogPathToTrim?: string,
  basePublicPathToTrim?: string
} = {}) {
  const {
    repositoryName = "",
    baseRoute = "blog",
    basePublic = "images",
    baseBlogPathToTrim = "2.Ref(데이터 및 정보 저장)/",
    basePublicPathToTrim = "config/"
  } = options;

  return async (tree: Root) => {
    const promises: Promise<void>[] = [];
    const changes: (() => void)[] = [];

    // 1. Callout 변환
    visit(tree, 'blockquote', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      const promise = blockquoteToCallOut(node, changes, parent, index)();
      promises.push(promise);
    });
    await Promise.all(promises);
    changes.forEach(fn => fn());
    promises.length = 0;
    changes.length = 0;


    // 3. 나머지 텍스트 기반 변환 (Embed, WikiLinks, Highlight)
    // 이들은 서로 영향을 주지 않으므로 한 번의 visit으로 처리 가능
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;

      let promise;
      promise = textToEmbed(node, baseBlogPathToTrim, basePublicPathToTrim, repositoryName, baseRoute, basePublic, changes, parent, index)();
      promises.push(promise);

      promise = textToWikiLinks(node, baseBlogPathToTrim, repositoryName, baseRoute, changes, parent, index)();
      promises.push(promise);

      promise = textToHighlight(node, changes, parent, index)();
      promises.push(promise);
    });
    await Promise.all(promises);
    changes.forEach(fn => fn());
    promises.length = 0;
    changes.length = 0;


    // 2. 줄바꿈을 <br>로 변환
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      const promise = textToLineBreak(node, changes, parent, index)();
      promises.push(promise);
    });
    // await Promise.all(promises);
    // changes.forEach(fn => fn());
    // promises.length = 0;
    // changes.length = 0;

    await Promise.all(promises);
    changes.forEach(fn => fn());
  };
}

/**
 * Remark 플러그인: 옵시디언 위키링크 `[[...]]`를 표준 링크 노드로 변환합니다.
 * ![[...]] 형식의 이미지 링크는 제외
 * @param options - 플러그인 옵션
 */
export function remarkWikiLinks(options: {
  repositoryName?: string,
  baseRoute?: string,
  basePathToTrim?: string
} = {}) {
  const {repositoryName = "", baseRoute = "blog", basePathToTrim = ""} = options;

  return async (tree: Root) => {
    const promises: Promise<void>[] = [];
    const changes: (() => void)[] = [];

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;

      const wikiLinkRegex = /(?<!!)\[\[([^\]]+)\]\]/g;
      if (!wikiLinkRegex.test(node.value)) return;

      // 각 텍스트 노드에 대한 비동기 처리 작업을 프로미스로 만듭니다.
      const promise = (async () => {
        const newChildren: (Text | Link)[] = [];
        let lastIndex = 0;
        let match;

        wikiLinkRegex.lastIndex = 0; // 정규식의 lastIndex를 초기화해야 합니다.
        while ((match = wikiLinkRegex.exec(node.value)) !== null) {
          if (match.index > lastIndex) {
            newChildren.push({type: 'text', value: node.value.slice(lastIndex, match.index)});
          }

          const {path, header, alias} = parseWikiLinks(match[0]);

          let trimmedPath = path;
          if (basePathToTrim && trimmedPath.startsWith(basePathToTrim)) {
            trimmedPath = trimmedPath.slice(basePathToTrim.length);
          }

          // 1. await를 사용하여 비동기 함수의 결과를 기다립니다.
          const found = await findPostMetaDataByUniqueKeyword(trimmedPath);

          let href = '#';
          const linkText = alias || trimmedPath.split('/').pop() || trimmedPath;

          // 2. 이제 'found'는 Promise가 아닌 실제 PostMetadata 객체 또는 undefined입니다.
          if (found) {
            href = `/${repositoryName ? repositoryName + "/" : ""}${baseRoute}/${found.slugHash}`;
            if (header) href += `#${encodeURIComponent(header)}`;
          }

          newChildren.push({
            type    : 'link',
            url     : href,
            children: [{type: 'text', value: linkText}]
          });

          lastIndex = wikiLinkRegex.lastIndex;
        }

        if (lastIndex < node.value.length) {
          newChildren.push({type: 'text', value: node.value.slice(lastIndex)});
        }

        if (newChildren.length > 0) {
          changes.push(() => {
            parent.children.splice(index, 1, ...newChildren);
          });
        }
      })();
      promises.push(promise);
    });

    // 3. 모든 비동기 작업이 완료될 때까지 기다립니다.
    await Promise.all(promises);

    // 4. 모든 변경 사항을 트리에 일괄 적용합니다.
    changes.forEach(fn => fn());
  };
}
