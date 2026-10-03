package SHEild.Backend.controller;

import SHEild.Backend.dto.LoginRequest;
import SHEild.Backend.dto.UserResponse;
import SHEild.Backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @RequestBody LoginRequest request) {

        UserResponse user = authService.login(request);

        return ResponseEntity.ok(user);
    }
}