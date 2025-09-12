"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PostType } from '@/types/post.type';
import PostList from '@/components/PostList';
import styles from '@/app/search/SearchPage.module.scss';

type SearchContentProps = {
  allPosts: PostType[];
};

export default function SearchContent({ allPosts }: SearchContentProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [searchResults, setSearchResults] = useState<PostType[]>([]);

  useEffect(() => {
    if (query) {
      const filteredPosts = allPosts.filter(post =>
        (
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.aliases?.some(alias => alias.toLowerCase().includes(query.toLowerCase()))
        )
      );
      setSearchResults(filteredPosts);
    } else {
      setSearchResults([]);
    }
  }, [query, allPosts]);

  return (
    <div className={styles.container}>
      <h1>Results for: <span>&nbsp;{query || ''}&nbsp;</span></h1>
      {query ? (
        searchResults.length > 0 ? (
          <PostList posts={searchResults} />
        ) : (
          <p className={styles.noResults}>No posts found for &nbsp;{query}&nbsp;.</p>
        )
      ) : (
        <p className={styles.noResults}>Please enter a search term.</p>
      )}
    </div>
  );
}