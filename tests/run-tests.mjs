import test from 'node:test';
import assert from 'node:assert/strict';

// Test 1: Category Schema & Slug Validation
test('Category Validation: Accepts valid slug and rejects invalid slugs', async () => {
  const { categorySchema } = await import('../src/lib/validation/index.js');
  
  const valid = categorySchema.safeParse({
    name: 'State Space Control',
    slug: 'state-space-control',
    description: 'Modern multivariable control',
    display_order: 1,
  });
  assert.equal(valid.success, true);

  const invalid = categorySchema.safeParse({
    name: 'Invalid Category',
    slug: 'INVALID SLUG WITH SPACES!',
  });
  assert.equal(invalid.success, false);
});

// Test 2: Article Schema & Validation
test('Article Validation: Enforces required fields and status enum', async () => {
  const { articleSchema } = await import('../src/lib/validation/index.js');

  const validDraft = articleSchema.safeParse({
    title: 'Optimal LQR Control',
    slug: 'optimal-lqr-control',
    description: 'First principles derivation',
    content_markdown: '## Mathematical Formulation\n$$\\dot{x} = Ax + Bu$$',
    category_id: 'cat-control',
    status: 'draft',
    is_featured: false,
  });
  assert.equal(validDraft.success, true);

  const missingTitle = articleSchema.safeParse({
    title: '',
    slug: 'no-title',
    description: 'desc',
    content_markdown: 'content',
    category_id: 'cat-1',
  });
  assert.equal(missingTitle.success, false);
});

// Test 3: Reading Time Calculation
test('Utilities: Calculates correct estimated reading time', async () => {
  const { calculateReadingTime } = await import('../src/lib/utils.js');
  
  const shortText = 'One two three four five';
  assert.equal(calculateReadingTime(shortText), 1);

  // 450 words should be ~3 minutes (at 200 wpm)
  const longText = new Array(450).fill('word').join(' ');
  assert.equal(calculateReadingTime(longText), 3);
});

// Test 4: Vietnamese and Unicode Slug Generation
test('Utilities: Generates clean SEO slugs with Vietnamese diacritics', async () => {
  const { slugify } = await import('../src/lib/utils.js');

  assert.equal(slugify('Hệ Thống Điều Khiển Tự Động'), 'he-thong-dieu-khien-tu-dong');
  assert.equal(slugify('Robotics & Kinematics 2025!'), 'robotics-kinematics-2025');
  assert.equal(slugify('Linear Quadratic Regulator (LQR)'), 'linear-quadratic-regulator-lqr');
});

// Test 5: In-Memory / Database Store Filtering
test('Data Store: Filters published articles and excludes drafts from public feed', async () => {
  const { getPublishedBlogPosts, saveBlogPost } = await import('../src/lib/data/store.js');

  // Add a test draft post
  await saveBlogPost({
    title: 'Secret Draft Article',
    slug: 'secret-draft-article',
    description: 'This must not appear publicly',
    content_markdown: 'Confidential robotics research',
    category_id: 'cat-control',
    status: 'draft',
  });

  const publicPosts = await getPublishedBlogPosts();
  const foundDraft = publicPosts.find((p) => p.slug === 'secret-draft-article');
  assert.equal(foundDraft, undefined, 'Draft article must NOT be returned in public feed');
});

// Test 6: Search & Category Filtering
test('Data Store: Searches articles by title and content keyword', async () => {
  const { getPublishedBlogPosts } = await import('../src/lib/data/store.js');

  const lqrResults = await getPublishedBlogPosts({ search: 'Riccati' });
  assert.ok(lqrResults.length >= 1, 'Should find post containing Riccati equation');

  const noResults = await getPublishedBlogPosts({ search: 'NonExistentTopicXYZ123' });
  assert.equal(noResults.length, 0);
});

// Test 7: Nested Category Hierarchy
test('Data Store: Builds nested category hierarchy correctly', async () => {
  const { getBlogCategories, saveCategory } = await import('../src/lib/data/store.js');

  // Create parent
  const parent = await saveCategory({
    name: 'Test Robotics Parent',
    slug: 'test-robotics-parent',
    description: 'Parent category',
  });

  // Create child
  const child = await saveCategory({
    name: 'Test Kinematics Child',
    slug: 'test-kinematics-child',
    parent_id: parent.id,
    description: 'Child category',
  });

  const tree = await getBlogCategories();
  const parentInTree = tree.find((c) => c.id === parent.id);
  assert.ok(parentInTree, 'Parent must exist in hierarchy');
  assert.ok(parentInTree.children?.some((c) => c.id === child.id), 'Child must be nested under parent');
});

// Test 8: Prevent Category Deletion with Articles
test('Data Store: Rejects category deletion when articles are assigned to it', async () => {
  const { deleteCategory } = await import('../src/lib/data/store.js');

  // cat-control-optimal has post-1 assigned to it
  const result = await deleteCategory('cat-control-optimal');
  assert.equal(result.success, false, 'Deletion should be rejected when articles exist');
  assert.ok(result.error?.includes('articles are assigned'));
});

// Test 9: DOCX Export Generation
test('Export Pipeline: Generates valid Microsoft Word DOCX buffer', async () => {
  const { Document, Packer, Paragraph, TextRun } = await import('docx');

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'Robotics Engineering Technical Report', bold: true }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  assert.ok(buffer instanceof Buffer || buffer instanceof Uint8Array);
  assert.ok(buffer.length > 500, 'DOCX buffer should be non-empty and well-formed');
});
