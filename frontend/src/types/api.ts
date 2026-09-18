export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE";

export interface Task {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
}

export interface UpdateTaskRequest {
    title: string;
    description?: string;
    status: TaskStatus;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface ProblemDetail {
    type?: string;
    title?: string;
    status: number;
    detail?: string;
    instance?: string;
    errors?: Record<string, string>;
}