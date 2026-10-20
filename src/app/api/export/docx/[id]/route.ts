import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostById } from '@/lib/data/store';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    return new NextResponse('Article not found', { status: 404 });
  }

  // Parse lines of markdown into Word paragraphs
  const docParagraphs: Paragraph[] = [];

  // Title
  docParagraphs.push(
    new Paragraph({
      text: post.title,
      heading: HeadingLevel.TITLE,
      spacing: { after: 200 },
    })
  );

  // Subtitle / Abstract
  if (post.description) {
    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Abstract: ${post.description}`,
            italics: true,
          }),
        ],
        spacing: { after: 300 },
      })
    );
  }

  // Process markdown body lines
  const lines = post.content_markdown.split('\n');
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeBuffer.join('\n'),
                font: 'Consolas',
                size: 20,
              }),
            ],
            spacing: { before: 100, after: 100 },
          })
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (line.startsWith('### ')) {
      docParagraphs.push(
        new Paragraph({
          text: line.replace('### ', ''),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      );
    } else if (line.startsWith('## ')) {
      docParagraphs.push(
        new Paragraph({
          text: line.replace('## ', ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 100 },
        })
      );
    } else if (line.startsWith('# ')) {
      docParagraphs.push(
        new Paragraph({
          text: line.replace('# ', ''),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 150 },
        })
      );
    } else if (line.trim().length > 0) {
      docParagraphs.push(
        new Paragraph({
          children: [new TextRun(line)],
          spacing: { after: 120 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docParagraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(buffer as any, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${post.slug}.docx"`,
    },
  });
}
