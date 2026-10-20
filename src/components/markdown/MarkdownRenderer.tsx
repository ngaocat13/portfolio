'use client';

import React, { useEffect, useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { MermaidDiagram } from './MermaidDiagram';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [specialBlocks, setSpecialBlocks] = useState<Array<{ type: 'mermaid' | 'code'; content: string; language?: string }>>([]);

  useEffect(() => {
    let isMounted = true;

    async function processMarkdown() {
      try {
        const katex = (await import('katex')).default;

        // 1. First, extract code blocks and mermaid diagrams so they don't get altered by text replace
        const blocks: Array<{ type: 'mermaid' | 'code'; content: string; language?: string }> = [];
        let cleanText = content.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
          const index = blocks.length;
          if (lang.trim().toLowerCase() === 'mermaid') {
            blocks.push({ type: 'mermaid', content: code.trim() });
          } else {
            blocks.push({ type: 'code', content: code.trimEnd(), language: lang.trim() || 'text' });
          }
          return `<!--BLOCK_${index}-->`;
        });

        // 2. Render Block Math ($$ ... $$)
        cleanText = cleanText.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
          try {
            return `<div class="katex-display">${katex.renderToString(math.trim(), { displayMode: true, throwOnError: false })}</div>`;
          } catch {
            return `$$${math}$$`;
          }
        });

        // 3. Render Inline Math ($ ... $)
        cleanText = cleanText.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
          try {
            return `<span class="katex-inline">${katex.renderToString(math.trim(), { displayMode: false, throwOnError: false })}</span>`;
          } catch {
            return `$${math}$`;
          }
        });

        // 4. Render Headings with IDs for TOC
        cleanText = cleanText.replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, text) => {
          const level = hashes.length;
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          return `<h${level} id="${id}" class="scroll-mt-20">${text}</h${level}>`;
        });

        // 5. Basic paragraphs, bold, italic, lists, and links
        cleanText = cleanText
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>')
          .replace(/^\s*-\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
          .replace(/^\s*\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

        // Wrap plain line breaks into paragraphs
        const sections = cleanText.split(/\n\n+/);
        const html = sections
          .map((sec) => {
            const trimmed = sec.trim();
            if (
              trimmed.startsWith('<h') ||
              trimmed.startsWith('<div class="katex') ||
              trimmed.startsWith('<!--BLOCK_') ||
              trimmed.startsWith('<li')
            ) {
              return trimmed;
            }
            return `<p class="leading-relaxed my-4">${trimmed.replace(/\n/g, '<br/>')}</p>`;
          })
          .join('\n');

        if (isMounted) {
          setSpecialBlocks(blocks);
          setRenderedHtml(html);
        }
      } catch (e) {
        if (isMounted) {
          setRenderedHtml(`<pre>${content}</pre>`);
        }
      }
    }

    processMarkdown();

    return () => {
      isMounted = false;
    };
  }, [content]);

  // Split renderedHtml around <!--BLOCK_X--> placeholders to inject interactive CodeBlock and MermaidDiagram
  const parts = renderedHtml.split(/(<!--BLOCK_\d+-->)/);

  return (
    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
      {parts.map((part, index) => {
        const match = part.match(/<!--BLOCK_(\d+)-->/);
        if (match) {
          const blockIdx = parseInt(match[1], 10);
          const block = specialBlocks[blockIdx];
          if (!block) return null;

          if (block.type === 'mermaid') {
            return <MermaidDiagram key={index} chart={block.content} />;
          }
          return (
            <CodeBlock
              key={index}
              language={block.language}
              code={block.content}
            />
          );
        }

        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: part }}
          />
        );
      })}
    </div>
  );
}
