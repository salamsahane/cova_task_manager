import type { ProblemDetail } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

const TOKEN_KEY = 'task-manager-token';

export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
    status: number;
    fieldErrors: Record<string, string>;

    constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
    }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = tokenStorage.get();

    const headers = new Headers(options.headers);
    if (options.body) {
        headers.set('Content-Type', 'application/json');
    }
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    let response: Response;
    try {
        response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    } catch {
        throw new ApiError(0, 'Impossible de joindre le serveur. Vérifiez votre connexion.');
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const isJson = response.headers.get('content-type')?.includes('json');
    const body = isJson ? await response.json() : null;

    if (!response.ok) {
        const problem = body as ProblemDetail | null;
        throw new ApiError(
            response.status,
            problem?.detail ?? 'Une erreur est survenue.',
            problem?.errors ?? {},
        );
    }

    return body as T;
}