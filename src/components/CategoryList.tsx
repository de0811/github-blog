"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CategoryNode } from '@/lib/post.lib';
import styles from './CategoryList.module.scss';

// 재귀적으로 카테고리 노드를 렌더링하는 내부 컴포넌트
const CategoryNodeItem: React.FC<{ node: CategoryNode; currentCategory: string | null }> = ({ node, currentCategory }) => {
  const isActive = currentCategory === node.tag;

  return (
    <li>
      <Link href={`/blog?category=${node.tag}`} className={isActive ? styles.active : ''}>
        <span className={styles.name}>{node.name}</span>
        <span className={styles.count}>({node.count})</span>
      </Link>
      {/* 하위 카테고리가 있으면 재귀적으로 렌더링 */}
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map(child => (
            <CategoryNodeItem key={child.tag} node={child} currentCategory={currentCategory} />
          ))}
        </ul>
      )}
    </li>
  );
};

// 전체 카테고리 목록을 렌더링하는 메인 컴포넌트
const CategoryList: React.FC<{ categories: CategoryNode[] }> = ({ categories }) => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <nav className={styles.categoryNav}>
      <h2>Categories</h2>
      <ul>
        {/* '전체 보기' 링크 */}
        <li>
          <Link href="/blog" className={!currentCategory ? styles.active : ''}>
            <span className={styles.name}>All Posts</span>
          </Link>
        </li>
        {/* 카테고리 트리 렌더링 */}
        {categories.map(node => (
          <CategoryNodeItem key={node.tag} node={node} currentCategory={currentCategory} />
        ))}
      </ul>
    </nav>
  );
};

export default CategoryList;
