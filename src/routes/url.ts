// src/routes/url.ts
import { Hono } from 'hono'
import { db } from "../db/db-init" 
import { url } from '../db/schema';
import { eq, not, desc } from 'drizzle-orm';

const urlRouter = new Hono()

// GET: List URLs with pagination
urlRouter.get('/', async (c) => {
  try {
    const offset = parseInt(c.req.query('offset') || '0', 10);
    const limit = parseInt(c.req.query('limit') || '20', 10);
    const showArchived = c.req.query('archived') === 'true';

    const query = db.select().from(url);
    
    if (!showArchived) {
      query.where(eq(url.archived, false));
    }

    const urlList = await query
      .orderBy(desc(url.createdAt))
      .limit(limit)
      .offset(offset);

    return c.json({ success: true, data: urlList });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch URLs' }, 500);
  }
})

// POST: Create a new short URL
urlRouter.post('/', async (c) => {
  try {
    const { slug, url: targetUrl, tags } = await c.req.json();

    const [newUrl] = await db.insert(url).values({
      slug,
      url: targetUrl,
      tags: tags || []
    }).returning();

    return c.json({ success: true, data: newUrl });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to create URL' }, 500);
  }
})

// PATCH: Edit an existing URL
urlRouter.patch('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    const { slug, url: targetUrl, tags, opened } = await c.req.json();

    const [updatedUrl] = await db.update(url)
      .set({
        slug,
        url: targetUrl,
        tags,
        opened
      })
      .where(eq(url.id, id))
      .returning(); 

    if (!updatedUrl) return c.json({ success: false, error: 'URL not found' }, 404);

    return c.json({ success: true, data: updatedUrl });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to update URL' }, 500);
  }
})

// DELETE: Soft-delete/Archive
urlRouter.delete('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));

    const [archivedUrl] = await db.update(url)
      .set({ archived: not(url.archived) })
      .where(eq(url.id, id))
      .returning();

    if (!archivedUrl) return c.json({ success: false, error: 'URL not found' }, 404);

    return c.json({ success: true, data: archivedUrl });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to archive URL' }, 500);
  }
})

export default urlRouter
