export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export type T2IRequest = { prompt: string; size?: string; n?: number; image?: string | string[] };
export type T2IResponse = { images: string[] };

export type I2_3DCreateResponse = { taskId: string; status: JobStatus };
export type I2_3DTaskResponse = {
  taskId: string;
  status: JobStatus;
  modelUrl?: string;
  error?: string;
};
