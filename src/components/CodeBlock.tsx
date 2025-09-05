// src/components/CodeBlock.tsx
import styles from './CodeBlock.module.scss';
import { LANGUAGE_ICONS } from '@/lib/obsidian.lib';

interface CodeBlockProps {
  language?: string;
  title?: string;
  highlightedCodeHtml: string;
}

export default function CodeBlock({ language, title, highlightedCodeHtml }: CodeBlockProps) {
  const lang = language?.toLowerCase() || 'unknown';
  const iconHtml = LANGUAGE_ICONS[lang] || LANGUAGE_ICONS.sh; // 언어 아이콘, 없으면 기본 'sh' 아이콘

  return (
    <div className={styles.customCodeBlock}>
      <div className={styles.customCodeBlockHeader}>
        <div className={styles.customCodeBlockLang}>
          <span
            className={styles.customCodeBlockIcon}
            dangerouslySetInnerHTML={{ __html: iconHtml }}
          />
          <span className={styles.langText}>{lang}</span>
        </div>
        {title && <div className={styles.customCodeBlockTitle}>{title}</div>}
      </div>
      <pre>
        <code
          className={`hljs ${language}`}
          dangerouslySetInnerHTML={{ __html: highlightedCodeHtml }}
        />
      </pre>
    </div>
  );
}