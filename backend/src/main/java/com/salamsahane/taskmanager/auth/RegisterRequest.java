package com.salamsahane.taskmanager.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank
        @Email(regexp = "^[^@\\s]+@[^@\\s]+\\.[A-Za-z]{2,}$")
        @Size(max = 255)
        String email,
        @NotBlank @Size(min = 8, max = 72) String password
) {
}