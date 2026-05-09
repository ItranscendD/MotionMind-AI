import Fastify from 'fastify';
import { PrismaClient } from '../prisma/generated';
import dotenv from 'dotenv';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

// Production Infrastructure Initialization
const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null
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

const fastify = Fastify({
  logger: true
});

const prisma = new PrismaClient();

fastify.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// User Sync (called on login)
fastify.post('/api/user/sync', async (request: any, reply) => {
  const { email, name } = request.body;
  const user = await prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name }
  });
  return user;
});

// Create Workspace
fastify.post('/api/workspaces', async (request: any, reply) => {
  const { name, ownerId } = request.body;
  const workspace = await prisma.workspace.create({
    data: { name, ownerId }
  });
  return workspace;
});

// Update User Preferences
fastify.post('/api/user/preferences', async (request: any, reply) => {
  const { userId, role, useCase, onboardingCompleted, tourDismissed } = request.body;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role, useCase, onboardingCompleted, tourDismissed }
  });
  return user;
});

// Style Ingestion Routes
fastify.post('/api/styles/upload-intent', async (request: any, reply) => {
  const { fileName, fileSize, fileType } = request.body;
  
  const uploadId = `up_${Math.random().toString(36).substring(7)}`;
  const key = `uploads/${uploadId}/${fileName}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3Client as any, command as any, { expiresIn: 3600 });

  return { 
    uploadId,
    urls: [url] 
  };
});

fastify.post('/api/styles/jobs', async (request: any, reply) => {
  const { uploadId, userId, workspaceId, type } = request.body;
  const job = await styleQueue.add('extract', {
    uploadId,
    userId,
    workspaceId,
    type
  });
  return { jobId: job.id };
});

fastify.get('/api/styles/jobs/:id', async (request: any, reply) => {
  const { id } = request.params;
  const job = await styleQueue.getJob(id);
  if (!job) return reply.status(404).send({ error: 'Job not found' });
  
  const state = await job.getState();
  return { 
    id: job.id,
    state,
    progress: job.progress,
    result: job.returnvalue
  };
});

// Generation Routes
fastify.post('/api/generate', async (request: any, reply) => {
  const { prompt, params, styleId, userId, workspaceId } = request.body;
  
  // Create job in style queue (generation currently handled there)
  const job = await styleQueue.add('generate', {
    prompt,
    params,
    styleId,
    userId,
    workspaceId
  });

  // Log prompt history
  await prisma.generationJob.create({
    data: {
      id: job.id,
      status: 'QUEUED',
      payload: JSON.stringify({ prompt, params }),
    }
  });

  return { jobId: job.id };
});

fastify.get('/api/jobs/:id/stream', async (request: any, reply) => {
  const { id } = request.params;
  
  reply.raw.setHeader('Content-Type', 'text/event-stream');
  reply.raw.setHeader('Cache-Control', 'no-cache');
  reply.raw.setHeader('Connection', 'keep-alive');

  const send = (data: any) => {
    reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Poll for job status (SSE implementation for BullMQ)
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

  request.raw.on('close', () => {
    clearInterval(interval);
  });
});

// Project Routes
fastify.get('/api/projects/:id', async (request: any, reply) => {
  const { id } = request.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { versions: true }
  });
  if (!project) return reply.status(404).send({ error: 'Project not found' });
  return project;
});

fastify.patch('/api/projects/:id', async (request: any, reply) => {
  const { id } = request.params;
  const { name, config } = request.body;
  const project = await prisma.project.update({
    where: { id },
    data: { name, updatedAt: new Date() }
  });
  return project;
});

// AI Edit Routes
fastify.post('/api/edit', async (request: any, reply) => {
  const { instruction, projectId, sceneState } = request.body;
  const prompt = instruction.toLowerCase();

  // Simulated Claude AI Logic
  const ops: any[] = [];
  
  if (prompt.includes('color') && !prompt.includes('what') && !prompt.includes('which')) {
    if (prompt.includes('all') || prompt.includes('everything')) {
      sceneState.layers.forEach((l: any) => {
        ops.push({ op: 'SET_PROPERTY', layerId: l.id, property: 'style.fill', value: '#FFFFFF' });
      });
    } else {
      // Ambiguity check
      return { 
        clarify: true, 
        question: "Which layer's color should I change? You can say 'all layers' or specify a name." 
      };
    }
  }

  if (prompt.includes('move') || prompt.includes('earlier') || prompt.includes('later')) {
    const shift = prompt.includes('earlier') ? -0.5 : 0.5;
    // Find a text layer as a target
    const target = sceneState.layers.find((l: any) => l.type === 'text');
    if (target) {
      ops.push({ op: 'MOVE_KEYFRAME', layerId: target.id, timeShift: shift });
    }
  }

  if (prompt.includes('remove') || prompt.includes('delete')) {
    const layer = sceneState.layers.find((l: any) => prompt.includes(l.name.toLowerCase()));
    if (layer) {
      ops.push({ op: 'DELETE_LAYER', layerId: layer.id });
    } else {
      return { clarify: true, question: "I couldn't find that layer. Which one should I delete?" };
    }
  }

  if (prompt.includes('ease') || prompt.includes('slow down')) {
    ops.push({ op: 'SET_EASE', layerId: 'all', easing: 'ease-in-out' });
  }

  if (ops.length === 0) {
    return { clarify: true, question: "I'm not sure how to help with that yet. Try 'Make everything white' or 'Move the headline earlier'." };
  }

  return { 
    ops,
    suggestions: [
      { id: 'ease-assist', type: 'EASE', title: 'Ease Assist', desc: 'Add subtle easing to the exit animation.' },
      { id: 'brand-check', type: 'BRAND', title: 'Brand Checker', desc: 'Shift colors to match your style profile.' }
    ]
  };
});

// Auto-Animate Routes
fastify.post('/api/auto-animate/upload', async (request: any, reply) => {
  const { userId, workspaceId } = request.body;
  
  const job = await styleQueue.add('auto-animate', {
    userId,
    workspaceId
  });

  return { jobId: job.id };
});

fastify.get('/api/auto-animate/jobs/:id', async (request: any, reply) => {
  const { id } = request.params;
  const job = await styleQueue.getJob(id);
  if (!job) return reply.status(404).send({ error: 'Job not found' });

  const state = await job.getState();
  return { 
    id: job.id,
    state,
    progress: job.progress,
    result: job.returnvalue
  };
});

// Scene Scanning Routes
fastify.post('/api/scan', async (request: any, reply) => {
  const { sceneState, styleProfile } = request.body;
  const suggestions: any[] = [];

  // 1. Timing Scan
  sceneState.layers.forEach((l: any) => {
    // Mock duration check (if duration is not set, assume it's short for demo)
    const duration = l.duration || 1;
    if (l.type === 'text' && duration < 2) {
      suggestions.push({
        id: `timing-${l.id}`,
        ruleId: 'timing-short',
        severity: 'WARNING',
        title: 'Text duration too short',
        layerId: l.id,
        layerName: l.name,
        desc: 'This text is visible for less than 2 seconds, which may be hard for viewers to read.',
        fix: { op: 'UPDATE_LAYER', property: 'duration', value: 3 }
      });
    }
  });

  // 2. Brand Scan
  if (styleProfile?.palette) {
    sceneState.layers.forEach((l: any) => {
      if (l.style?.fill && !styleProfile.palette.includes(l.style.fill.toUpperCase())) {
        suggestions.push({
          id: `brand-${l.id}`,
          ruleId: 'brand-mismatch',
          severity: 'WARNING',
          title: 'Off-palette color detected',
          layerId: l.id,
          layerName: l.name,
          desc: `The color ${l.style.fill} is not in your brand style profile.`,
          fix: { op: 'UPDATE_LAYER', property: 'style.fill', value: styleProfile.palette[0] }
        });
      }
    });
  }

  // 3. Easing Scan
  sceneState.layers.forEach((l: any) => {
    const hasLinear = Object.values(l.keyframes || {}).some((kfs: any) => kfs.some((kf: any) => kf.easing === 'linear'));
    if (hasLinear || Object.keys(l.keyframes || {}).length === 0) {
      suggestions.push({
        id: `easing-${l.id}`,
        ruleId: 'easing-linear',
        severity: 'TIP',
        title: 'Linear motion detected',
        layerId: l.id,
        layerName: l.name,
        desc: 'Using ease-in-out would make this motion feel more natural and cinematic.',
        fix: { op: 'SET_EASE', value: 'ease-in-out' }
      });
    }
  });

  return { suggestions };
});

// Review & Approval Routes
fastify.post('/api/projects/:id/review-links', async (request: any, reply) => {
  const { id } = request.params;
  const { expiry, password, permissions } = request.body;
  
  const token = Math.random().toString(36).substring(2, 15);
  // Mock store link (In real app, save to Prisma)
  return { 
    token, 
    url: `http://localhost:5173/review/${token}`,
    expiry,
    permissions 
  };
});

fastify.get('/api/review/:token', async (request: any, reply) => {
  const { token } = request.params;
  // Mock fetch review data
  return {
    id: 'link_123',
    projectId: 'proj_123',
    projectName: 'MotionMind Demo Video',
    version: 1,
    hasPassword: true,
    permissions: { comment: true, approve: true, download: false },
    sceneState: { /* mock state */ },
    comments: [
      { id: 'c1', type: 'TEXT', content: 'Great timing here!', timestamp: 2400, authorName: 'Alex' }
    ]
  };
});

fastify.post('/api/review/:token/comments', async (request: any, reply) => {
  const { token } = request.params;
  const { type, content, timestamp, markup, authorName } = request.body;
  
  return { 
    id: Math.random().toString(36).substring(7),
    type,
    content,
    timestamp,
    markup,
    authorName,
    createdAt: new Date().toISOString()
  };
});

fastify.post('/api/review/:token/approve', async (request: any, reply) => {
  const { token } = request.params;
  const { approverName } = request.body;
  
  return { status: 'APPROVED', approver: approverName };
});

// Export Routes
fastify.post('/api/export', async (request: any, reply) => {
  const { projectId, formats, resolution, userId, plan } = request.body;
  
  // Mock plan validation
  if (plan === 'FREE' && (resolution === '4K' || formats.includes('PRORES'))) {
    return reply.status(403).send({ 
      error: 'UPGRADE_REQUIRED', 
      message: '4K export and Professional formats require a Pro or Enterprise plan.' 
    });
  }

  const job = await renderQueue.add('export', {
    projectId,
    formats,
    resolution,
    userId
  });

  // Log export job
  await prisma.exportJob.create({
    data: {
      id: job.id,
      projectId,
      status: 'QUEUED',
      format: formats.join(','),
    }
  });

  return { jobId: job.id };
});

fastify.get('/api/export/:id/status', async (request: any, reply) => {
  const { id } = request.params;
  const job = await renderQueue.getJob(id);
  if (!job) return reply.status(404).send({ error: 'Export job not found' });

  const state = await job.getState();
  return { 
    id: job.id,
    state,
    progress: job.progress,
    result: job.returnvalue
  };
});

fastify.post('/api/webhooks', async (request: any, reply) => {
  const { url, events } = request.body;
  return { id: 'wh_123', url, events, status: 'ACTIVE' };
});

// Workspace & Team Routes
fastify.get('/api/teams', async (request: any, reply) => {
  return [
    { id: 't1', name: 'Creative Team', projectCount: 12, memberCount: 5 },
    { id: 't2', name: 'Marketing', projectCount: 8, memberCount: 3 }
  ];
});

fastify.post('/api/teams', async (request: any, reply) => {
  const { name, members } = request.body;
  return { id: 't3', name, projectCount: 0, memberCount: members.length };
});

// Shared Library Routes
fastify.get('/api/library', async (request: any, reply) => {
  return {
    logos: [{ id: 'a1', name: 'MotionMind Icon', url: '#', type: 'LOGO' }],
    fonts: [{ id: 'a2', name: 'Inter Bold', url: '#', type: 'FONT' }],
    colors: [{ id: 'a3', name: 'Brand Primary', content: '#4F46E5', type: 'COLOR' }],
    presets: [{ id: 'a4', name: 'Smooth Reveal', content: { ease: 'ease-in-out' }, type: 'PRESET' }]
  };
});

fastify.post('/api/library/upload', async (request: any, reply) => {
  return { id: 'a5', status: 'UPLOADED' };
});

// Admin & Analytics Routes
fastify.get('/api/admin/analytics', async (request: any, reply) => {
  return {
    generations: [
      { name: 'Mon', value: 400 },
      { name: 'Tue', value: 300 },
      { name: 'Wed', value: 600 },
      { name: 'Thu', value: 800 },
      { name: 'Fri', value: 500 },
      { name: 'Sat', value: 200 },
      { name: 'Sun', value: 100 }
    ],
    exports: [
      { name: 'MP4', value: 70 },
      { name: 'GIF', value: 20 },
      { name: 'Lottie', value: 10 }
    ],
    storage: { used: 45, total: 100 }
  };
});

fastify.get('/api/admin/audit-logs', async (request: any, reply) => {
  return [
    { id: 'au1', user: 'John Doe', action: 'EXPORT_PROJECT', resource: 'Proj A', timestamp: new Date().toISOString() },
    { id: 'au2', user: 'AI System', action: 'SCAN_COMPLETE', resource: 'Proj A', timestamp: new Date().toISOString() }
  ];
});

fastify.post('/api/admin/api-keys', async (request: any, reply) => {
  return { id: 'ak1', name: 'Zapier Integration', key: 'mm_live_' + Math.random().toString(36).substring(7) };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('Server is running on http://localhost:3001');
  } catch (err) {
    (fastify.log as any).error(err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  start();
}

export default async (req: any, res: any) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
};
