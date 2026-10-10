import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";

export interface QueueJob<T = any> {
  id: string;
  name: string;
  data: T;
  timestamp: number;
}

export interface QueueService {
  name: string;
  addJob<T>(queueName: string, jobName: string, data: T): Promise<string>;
  registerWorker<T, R>(queueName: string, processor: (job: { id: string; name: string; data: T }) => Promise<R>): void;
}

// 1. In-Memory Zero-Key Async Queue Service (Default Fallback)
export class InMemoryQueueService implements QueueService {
  name = "InMemoryAsyncQueue";
  private queues: Map<string, QueueJob[]> = new Map();
  private workers: Map<string, (job: any) => Promise<any>> = new Map();

  async addJob<T>(queueName: string, jobName: string, data: T): Promise<string> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const job: QueueJob<T> = {
      id: jobId,
      name: jobName,
      data,
      timestamp: Date.now()
    };

    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, []);
    }
    this.queues.get(queueName)!.push(job);

    // Asynchronously dispatch to registered worker
    const worker = this.workers.get(queueName);
    if (worker) {
      setTimeout(async () => {
        try {
          await worker(job);
        } catch (err) {
          console.error(`[InMemoryQueue] Error processing job ${jobId} in ${queueName}:`, err);
        }
      }, 50);
    }

    return jobId;
  }

  registerWorker<T, R>(queueName: string, processor: (job: { id: string; name: string; data: T }) => Promise<R>): void {
    this.workers.set(queueName, processor);

    // Process any previously queued jobs
    const existing = this.queues.get(queueName) || [];
    while (existing.length > 0) {
      const j = existing.shift()!;
      setTimeout(() => processor(j), 10);
    }
  }
}

// 2. BullMQ Redis Queue Service
export class BullMQRedisService implements QueueService {
  name = "BullMQRedisService";
  private redisConnection: Redis;
  private bullQueues: Map<string, Queue> = new Map();

  constructor(redisUrl = process.env.REDIS_URL || "redis://localhost:6379") {
    this.redisConnection = new Redis(redisUrl, { maxRetriesPerRequest: null, lazyConnect: true });
  }

  private getBullQueue(name: string): Queue {
    if (!this.bullQueues.has(name)) {
      const q = new Queue(name, { connection: this.redisConnection });
      this.bullQueues.set(name, q);
    }
    return this.bullQueues.get(name)!;
  }

  async addJob<T>(queueName: string, jobName: string, data: T): Promise<string> {
    const q = this.getBullQueue(queueName);
    const job = await q.add(jobName, data);
    return job.id || `bull_${Date.now()}`;
  }

  registerWorker<T, R>(queueName: string, processor: (job: { id: string; name: string; data: T }) => Promise<R>): void {
    new Worker(
      queueName,
      async (bullJob: Job) => {
        return processor({ id: bullJob.id!, name: bullJob.name, data: bullJob.data });
      },
      { connection: this.redisConnection }
    );
  }
}

// Global active instance
let globalQueueService: QueueService | null = null;

export function getActiveQueueService(): QueueService {
  if (globalQueueService) return globalQueueService;

  if (process.env.REDIS_URL) {
    try {
      globalQueueService = new BullMQRedisService(process.env.REDIS_URL);
      return globalQueueService;
    } catch (err) {
      console.warn("[Queue] Falling back to InMemoryQueueService:", err);
    }
  }

  globalQueueService = new InMemoryQueueService();
  return globalQueueService;
}

// Standard Queue Names per PRD
export const QUEUES = {
  RESUME_PROCESSING: "resume_processing",
  SESSION_MIGRATION: "session_migration",
  JOB_INGESTION: "job_ingestion"
};
