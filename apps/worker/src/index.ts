import { Worker, Job, Queue } from 'bullmq';
import IORedis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';

dotenv.config();

const prisma = new PrismaClient();
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock',
  },
});

console.log('Production Workers starting...');

// 1. Style Extraction Worker
const styleWorker = new Worker('style-extraction', async (job: Job) => {
  console.log(`Processing extraction ${job.id}...`);
  
  if (job.name === 'extract') {
    await job.updateProgress(20);
    // Simulated dimension extraction
    const extraction = {
      color: { palette: ['#4F46E5', '#D97706', '#0F0F11'], contrast: 0.8 },
      typography: { fonts: ['Inter', 'Roboto Mono'], weight: 'bold' },
      motion: { opticalFlow: 'high-velocity', easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
    };
    await job.updateProgress(80);
    
    // Save to DB
    await prisma.styleProfile.create({
      data: {
        id: job.id,
        name: `Style ${job.id}`,
        workspaceId: job.data.workspaceId,
        dimensions: JSON.stringify(extraction),
      }
    });

    await job.updateProgress(100);
    return { extraction };
  }
}, { connection });

// 2. Render & Export Worker
const renderWorker = new Worker('render-pipeline', async (job: Job) => {
  console.log(`Processing render ${job.id}...`);

  if (job.name === 'export') {
    const formats = job.data.formats || ['MP4'];
    const assets = [];

    for (const format of formats) {
      await job.updateProgress((assets.length / formats.length) * 100);
      
      // Simulate FFmpeg / Compositor render
      console.log(`Rendering ${format}...`);
      const mockStream = Readable.from([Buffer.from('mock video content')]);
      
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.S3_BUCKET_NAME || 'motionmind-assets',
          Key: `exports/${job.id}/${job.id}.${format.toLowerCase()}`,
          Body: mockStream,
          ContentType: `video/${format.toLowerCase()}`
        }
      });

      await upload.done();
      
      const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/exports/${job.id}/${job.id}.${format.toLowerCase()}`;
      
      assets.push({ format, url, size: '12.4 MB' });
    }

    // Update ExportRecord in DB
    await prisma.exportRecord.create({
      data: {
        id: job.id,
        projectId: job.data.projectId,
        versionId: 'v1', // Mocked version
        format: formats.join(','),
        resolution: job.data.resolution,
        fps: 30,
        url: assets[0].url,
      }
    });

    await job.updateProgress(100);
    return { assets };
  }
}, { connection });

styleWorker.on('completed', (job) => console.log(`Extraction ${job.id} completed`));
renderWorker.on('completed', (job) => console.log(`Render ${job.id} completed`));
renderWorker.on('failed', (job, err) => console.error(`Render ${job?.id} failed:`, err));
