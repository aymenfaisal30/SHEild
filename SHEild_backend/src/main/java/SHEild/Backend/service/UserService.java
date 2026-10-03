package SHEild.Backend.service;

import SHEild.Backend.dto.RegisterRequest;
import SHEild.Backend.entity.User;
import SHEild.Backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import SHEild.Backend.dto.UserResponse;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse createUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Phone number is already registered.");
        }

        User user = new User();

        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Hash the password before storing it
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);

    return new UserResponse(
        savedUser.getUserId(),
        savedUser.getEmail(),
        savedUser.getPhone(),
        savedUser.getAccountStatus(),
        savedUser.getEmailVerified(),
        savedUser.getPhoneVerified()
);
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateUser(Long userId, User updatedUser) {

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhone(updatedUser.getPhone());

        return userRepository.save(existingUser);
    }

    public void deleteUser(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found.");
        }

        userRepository.deleteById(userId);
    }
}