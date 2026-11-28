package com.backend.service;

import com.backend.entity.PasswordResetCode;
import com.backend.entity.User;
import com.backend.exception.BadRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.repository.PasswordResetCodeRepository;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@Transactional
public class ForgotPasswordService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordResetCodeRepository resetCodeRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public ForgotPasswordService(UserRepository userRepository,
                                 PasswordResetCodeRepository resetCodeRepository,
                                 JavaMailSender mailSender,
                                 PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.resetCodeRepository = resetCodeRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    public void sendResetCode(String email) {
        if (isBlank(email)) {
            throw new BadRequestException("Email is required");
        }

        String normalizedEmail = email.trim();
        userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + normalizedEmail + " not found"));

        String code = String.format("%06d", RANDOM.nextInt(1_000_000));

        PasswordResetCode resetCode = resetCodeRepository.findByEmail(normalizedEmail)
                .orElseGet(PasswordResetCode::new);
        resetCode.setEmail(normalizedEmail);
        resetCode.setCode(code);
        resetCode.setCreatedAt(LocalDateTime.now());
        resetCode.setVerified(false);
        resetCodeRepository.save(resetCode);

        SimpleMailMessage message = new SimpleMailMessage();
        if (!isBlank(fromEmail)) {
            message.setFrom(fromEmail);
        }
        message.setTo(normalizedEmail);
        message.setSubject("Password Reset Verification Code");
        message.setText("Your 6-digit password reset code is: " + code);
        mailSender.send(message);
    }

    public void compareCode(String email, String inputCode) {
        if (isBlank(email) || isBlank(inputCode)) {
            throw new BadRequestException("Email and input-code are required");
        }

        PasswordResetCode saved = resetCodeRepository.findByEmail(email.trim())
                .orElseThrow(() -> new BadRequestException("No verification code found for this email"));

        if (!saved.getCode().equals(inputCode.trim())) {
            throw new BadRequestException("Invalid verification code");
        }

        saved.setVerified(true);
        resetCodeRepository.save(saved);
    }

    public void resetPassword(String email, String newPassword) {
        if (isBlank(email) || isBlank(newPassword)) {
            throw new BadRequestException("Email and newPassword are required");
        }

        String normalizedEmail = email.trim();
        PasswordResetCode saved = resetCodeRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("No verification code found for this email"));

        if (!saved.isVerified()) {
            throw new BadRequestException("Verification code has not been verified");
        }

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User with email " + normalizedEmail + " not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetCodeRepository.delete(saved);
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
