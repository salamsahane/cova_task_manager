import { apiFetch } from './client';
import type { CreateTaskRequest, Task, TaskStatus, UpdateTaskRequest } from '../types/api';

export function listTasks(status?: TaskStatus, q?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (q) params.set('q', q);

    const query = params.toString();
    return apiFetch<Task[]>(`/api/tasks${query ? `?${query}` : ''}`);
}

export function createTask(data: CreateTaskRequest): Promise<Task> {
    return apiFetch<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export function updateTask(id: number, data: UpdateTaskRequest): Promise<Task> {
    return apiFetch<Task>(`/api/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export function deleteTask(id: number): Promise<void> {
    return apiFetch<void>(`/api/tasks/${id}`, { method: 'DELETE' });
}