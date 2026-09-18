package com.salamsahane.taskmanager.auth;

public class EmailAlreadyUsedException extends RuntimeException {
    public EmailAlreadyUsedException() {
        super("Email Already Used");
    }
}
