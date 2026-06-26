import { Hono } from 'hono';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { db } from "../db/db-init" 
import { files } from '../db/schema';

const filesRouter = new Hono();

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${Bun.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: Bun.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: Bun.env.R2_SECRET_ACCESS_KEY || '',
  },
});

filesRouter.post('/', async (c) => {
  try {
    const body = await c.req.parseBody()

    const file = body['file']       

    if (!(file instanceof File)) {
        return c.text('File is required', 400)
    }

    const uniqueId = crypto.randomUUID();

    const name = file.name;
    const fileType = file.type;
    const fileSize = file.size;

    const buffer = await file.arrayBuffer()

      await r2Client.send(

        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: uniqueId,
            Body: Buffer.from(buffer),
            ContentType: fileType,        
        })
    );

    const fileUrl = `https://${process.env.R2_BUCKET}.r2.cloudflarestorage.com/${uniqueId}`;

    const [newFile] = await db.insert(files).values({
        id: uniqueId,
        name : name,
        fileType: fileType,
        fileSize: fileSize,
        fileurl: fileUrl
    }).returning();

    return c.json({
        success: true,
        data: newFile
    })


  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: error }, 500);
  }
});

filesRouter.get('/', async (c) => { // so i can get list of the files!
    const offset = parseInt(c.req.query('offset') || '0', 10);
    const limit = parseInt(c.req.query('limit') || '10', 10);
    const all = c.req.query('all') === 'true';

    const fileList = all 
      ? await db.select().from(files)
      : await db.select().from(files).limit(limit).offset(offset);
      
    return c.json({
      success: true,
      data: fileList
    })
  })

export default filesRouter;

// just make sure to add that its a unique timed link that expires in 24 hours or something, so that the files are not public forever!