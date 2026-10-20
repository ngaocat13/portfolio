import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostById } from '@/lib/data/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    return new NextResponse('Article not found', { status: 404 });
  }

  const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
description: "${post.description.replace(/"/g, '\\"')}"
category: "${post.category?.name || ''}"
published_at: "${post.published_at || ''}"
reading_time: ${post.reading_time_minutes}
---

`;

  const fullMarkdown = frontmatter + post.content_markdown;

  return new NextResponse(fullMarkdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${post.slug}.md"`,
    },
  });
}
