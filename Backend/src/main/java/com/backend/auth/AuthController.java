package com.backend.auth;

import com.backend.dto.CreateUserRequestDto;
import com.backend.dto.UserResponseDto;
import com.backend.entity.User;
import com.backend.repository.UserRepository;
import com.backend.security.JwtUtil;
import com.backend.service.ForgotPasswordService;
import com.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final ForgotPasswordService forgotPasswordService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserRepository userRepository,
                          UserService userService,
                          ForgotPasswordService forgotPasswordService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.userService = userService;
        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of(
                    "error", e.getClass().getSimpleName(),
                    "message", e.getMessage(),
                    "receivedEmail", String.valueOf(request.getEmail())
            ));
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(Map.of("token", token, "userId", user.getId()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CreateUserRequestDto request) {
        UserResponseDto createdUser = userService.createUser(request);

        String token = jwtUtil.generateToken(
                createdUser.getEmail(),
                createdUser.getRole());

        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        forgotPasswordService.sendResetCode(request != null ? request.getEmail() : null);
        return ResponseEntity.ok(Map.of("message", "Verification code sent to email"));
    }

    @PostMapping("/compare-code")
    public ResponseEntity<?> compareCode(@RequestBody CompareCodeRequest request) {
        forgotPasswordService.compareCode(
                request != null ? request.getEmail() : null,
                request != null ? request.getInputCode() : null
        );
        return ResponseEntity.ok(Map.of("message", "Code verified successfully"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        forgotPasswordService.resetPassword(
                request != null ? request.getEmail() : null,
                request != null ? request.getNewPassword() : null
        );
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
}
