import type { I2_3DTaskResponse, JobStatus } from "../types.js";

type Task = I2_3DTaskResponse & { createdAt: number; updatedAt: number };

const tasks = new Map<string, Task>();

function now() {
  return Date.now();
}

function makeId() {
  return `t_${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
}

export function createMock3DTask(): I2_3DTaskResponse {
  const taskId = makeId();
  const t: Task = { taskId, status: "queued", createdAt: now(), updatedAt: now() };
  tasks.set(taskId, t);

  setTimeout(() => update(taskId, "running"), 500);
  setTimeout(() => {
    const modelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
    const task = tasks.get(taskId);
    if (!task) return;
    tasks.set(taskId, { ...task, status: "succeeded", modelUrl, updatedAt: now() });
  }, 2500);

  return { taskId, status: t.status };
}

function update(taskId: string, status: JobStatus) {
  const t = tasks.get(taskId);
  if (!t) return;
  tasks.set(taskId, { ...t, status, updatedAt: now() });
}

export function getMock3DTask(taskId: string): I2_3DTaskResponse {
  const t = tasks.get(taskId);
  if (!t) return { taskId, status: "failed", error: "Task not found" };
  const { createdAt, updatedAt, ...rest } = t;
  return rest;
}
