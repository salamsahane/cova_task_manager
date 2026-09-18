package com.salamsahane.taskmanager.auth;

import com.salamsahane.taskmanager.user.User;
import com.salamsahane.taskmanager.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyUsedException();
        }

        User user = userRepository.save(new User(
                request.email(),
                passwordEncoder.encode(request.password())
        ));

        return AuthResponse.from(jwtService.generateToken(user.getId()));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Optional<User> user = userRepository.findByEmail(request.email());

        if (user.isEmpty() || !passwordEncoder.matches(request.password(), user.get().getPassword())) {
            throw new InvalidCredentialsException();
        }

        return AuthResponse.from(jwtService.generateToken(user.get().getId()));
    }
}