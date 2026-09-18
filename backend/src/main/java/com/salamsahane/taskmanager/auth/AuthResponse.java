package com.salamsahane.taskmanager.auth;

public record AuthResponse(String token) {
    public static AuthResponse from(String token) {
        return new AuthResponse(token);
    }
}
