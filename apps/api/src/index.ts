import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '../prisma/generated';
import dotenv from 'dotenv';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

// Global instances for lazy initialization
let prisma: PrismaClient | null = null;
let fastifyApp: FastifyInstance | null = null;

/**
 * Lazy initialize Prisma Client
 */
function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

// Infrastructure Initialization (External Services)
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
});

connection.on('error', (err) => {
  console.warn('Redis connection error (expected if Redis is not configured):', err.message);
});

const styleQueue = new Queue('style-extraction', { connection });
const renderQueue = new Queue('render-pipeline', { connection });

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock',
  },
});

/**
 * Build the Fastify application
 */
async function buildApp() {
  if (fastifyApp) return fastifyApp;

  const server = Fastify({
    logger: true
  });

  // 1. CORS Registration
  await server.register(cors, {
    origin: [
      process.env.FRONTEND_URL as string,
      /\.vercel\.app$/,
      'http://localhost:5173'
    ].filter(Boolean),
    credentials: true
  });

  // 2. Health Routes
  server.get('/health', async () => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    };
  });

  server.get('/api/health', async () => {
    return { 
      status: 'ok', 
      timestamp: new Date().toISOString() 
    };
  });

  server.get('/health/db', async (request, reply) => {
    try {
      await getPrisma().$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'connected' };
    } catch (err) {
      (server.log as any).error(err);
      return reply.status(500).send({ status: 'error', database: 'disconnected' });
    }
  });

  // 3. Application Routes (Restored from previous version)
  
  // User Sync
  server.post('/api/user/sync', async (request: any) => {
    const { email, name } = request.body;
    const user = await getPrisma().user.upsert({
      where: { email },
      update: { name },
      create: { email, name }
    });
    return user;
  });

  // Create Workspace
  server.post('/api/workspaces', async (request: any) => {
    const { name, ownerId } = request.body;
    const workspace = await getPrisma().workspace.create({
      data: { name, ownerId }
    });
    return workspace;
  });

  // Update User Preferences
  server.post('/api/user/preferences', async (request: any) => {
    const { userId, role, useCase, onboardingCompleted, tourDismissed } = request.body;
    const user = await getPrisma().user.update({
      where: { id: userId },
      data: { role, useCase, onboardingCompleted, tourDismissed }
    });
    return user;
  });

  // Style Ingestion
  server.post('/api/styles/upload-intent', async (request: any) => {
    const { fileName, fileSize, fileType } = request.body;
    const uploadId = `up_${Math.random().toString(36).substring(7)}`;
    const key = `uploads/${uploadId}/${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });
    const url = await getSignedUrl(s3Client as any, command as any, { expiresIn: 3600 });
    return { uploadId, urls: [url] };
  });

  server.post('/api/styles/jobs', async (request: any) => {
    const { uploadId, userId, workspaceId, type } = request.body;
    const job = await styleQueue.add('extract', { uploadId, userId, workspaceId, type });
    return { jobId: job.id };
  });

  server.get('/api/styles/jobs/:id', async (request: any, reply) => {
    const { id } = request.params;
    const job = await styleQueue.getJob(id);
    if (!job) return reply.status(404).send({ error: 'Job not found' });
    const state = await job.getState();
    return { id: job.id, state, progress: job.progress, result: job.returnvalue };
  });

  // Generation
  server.post('/api/generate', async (request: any) => {
    const { prompt, params, styleId, userId, workspaceId } = request.body;
    const job = await styleQueue.add('generate', { prompt, params, styleId, userId, workspaceId });
    await getPrisma().generationJob.create({
      data: { id: job.id as string, status: 'QUEUED', payload: JSON.stringify({ prompt, params }) }
    });
    return { jobId: job.id };
  });

  server.get('/api/jobs/:id/stream', async (request: any, reply) => {
    const { id } = request.params;
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');
    const send = (data: any) => { reply.raw.write(`data: ${JSON.stringify(data)}\n\n`); };
    const interval = setInterval(async () => {
      const job = await styleQueue.getJob(id) || await renderQueue.getJob(id);
      if (job) {
        const state = await job.getState();
        send({ progress: job.progress, state });
        if (state === 'completed' || state === 'failed') {
          clearInterval(interval);
          reply.raw.end();
        }
      } else {
        clearInterval(interval);
        reply.raw.end();
      }
    }, 1000);
    request.raw.on('close', () => { clearInterval(interval); });
  });

  // Projects
  server.get('/api/projects/:id', async (request: any, reply) => {
    const { id } = request.params;
    const project = await getPrisma().project.findUnique({ where: { id }, include: { versions: true } });
    if (!project) return reply.status(404).send({ error: 'Project not found' });
    return project;
  });

  server.patch('/api/projects/:id', async (request: any) => {
    const { id } = request.params;
    const { name } = request.body;
    return await getPrisma().project.update({ where: { id }, data: { name, updatedAt: new Date() } });
  });

  // AI Edit
  server.post('/api/edit', async (request: any) => {
    const { instruction, projectId, sceneState } = request.body;
    const prompt = instruction.toLowerCase();
    const ops: any[] = [];
    if (prompt.includes('color')) {
      if (prompt.includes('all')) {
        sceneState.layers.forEach((l: any) => { ops.push({ op: 'SET_PROPERTY', layerId: l.id, property: 'style.fill', value: '#FFFFFF' }); });
      } else {
        return { clarify: true, question: "Which layer's color should I change?" };
      }
    }
    if (prompt.includes('move')) {
      const shift = prompt.includes('earlier') ? -0.5 : 0.5;
      const target = sceneState.layers.find((l: any) => l.type === 'text');
      if (target) ops.push({ op: 'MOVE_KEYFRAME', layerId: target.id, timeShift: shift });
    }
    if (ops.length === 0) return { clarify: true, question: "I'm not sure how to help. Try 'Make everything white'." };
    return { ops, suggestions: [{ id: 'ease-assist', type: 'EASE', title: 'Ease Assist', desc: 'Add subtle easing.' }] };
  });

  // Auto-Animate
  server.post('/api/auto-animate/upload', async (request: any) => {
    const { userId, workspaceId } = request.body;
    const job = await styleQueue.add('auto-animate', { userId, workspaceId });
    return { jobId: job.id };
  });

  // Scan
  server.post('/api/scan', async (request: any) => {
    const { sceneState } = request.body;
    const suggestions: any[] = [];
    sceneState.layers.forEach((l: any) => {
      if (l.type === 'text' && (l.duration || 1) < 2) {
        suggestions.push({ id: `timing-${l.id}`, severity: 'WARNING', title: 'Text too short', layerName: l.name, desc: 'Visible for < 2s.' });
      }
    });
    return { suggestions };
  });

  // Export
  server.post('/api/export', async (request: any, reply) => {
    const { projectId, formats, resolution, plan } = request.body;
    if (plan === 'FREE' && resolution === '4K') {
      return reply.status(403).send({ error: 'UPGRADE_REQUIRED', message: '4K requires Pro.' });
    }
    const job = await renderQueue.add('export', { projectId, formats, resolution });
    await getPrisma().exportJob.create({ data: { id: job.id as string, projectId, status: 'QUEUED', format: formats.join(',') } });
    return { jobId: job.id };
  });

  server.get('/api/export/:id/status', async (request: any, reply) => {
    const { id } = request.params;
    const job = await renderQueue.getJob(id);
    if (!job) return reply.status(404).send({ error: 'Job not found' });
    const state = await job.getState();
    return { id: job.id, state, progress: job.progress, result: job.returnvalue };
  });

  // Library & Teams
  server.get('/api/teams', async () => [{ id: 't1', name: 'Creative Team' }]);
  server.get('/api/library', async () => ({ logos: [], fonts: [], colors: [], presets: [] }));

  fastifyApp = server;
  return server;
}

// Local Development Support
if (process.env.NODE_ENV !== 'production') {
  buildApp().then(s => {
    s.listen({ port: 3001, host: '0.0.0.0' }, (err) => {
      if (err) {
        (s.log as any).error(err);
        process.exit(1);
      }
      console.log('Local dev server running on http://localhost:3001');
    });
  });
}

// Vercel Serverless Entry Point
export default async (req: any, res: any) => {
  const server = await buildApp();
  await server.ready();
  server.server.emit('request', req, res);
};
