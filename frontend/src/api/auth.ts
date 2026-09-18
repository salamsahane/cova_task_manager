import { apiFetch } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/api';

export function login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}

export function register(credentials: RegisterRequest): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
}