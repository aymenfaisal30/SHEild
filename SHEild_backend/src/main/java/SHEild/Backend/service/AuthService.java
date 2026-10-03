package SHEild.Backend.service;

import SHEild.Backend.dto.LoginRequest;
import SHEild.Backend.dto.UserResponse;
import SHEild.Backend.entity.User;
import SHEild.Backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash())) {
//It compares the password the user enters with the BCrypt hash stored in MySQL.
            throw new IllegalArgumentException("Invalid email or password");
        }

        return new UserResponse(
                user.getUserId(),
                user.getEmail(),
                user.getPhone(),
                user.getAccountStatus(),
                user.getEmailVerified(),
                user.getPhoneVerified()
        );
    }
}