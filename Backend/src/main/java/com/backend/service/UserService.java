package com.backend.service;

import com.backend.entity.Role;
import com.backend.entity.User;
import com.backend.exception.BadRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor Injection
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // CREATE USER
    public User createUser(User user) {

        if (user == null) {
            throw new BadRequestException("User cannot be null");
        }

        if (isBlank(user.getUsername()) ||
                isBlank(user.getEmail()) ||
                isBlank(user.getPassword())) {

            throw new BadRequestException("Username, email, and password are required");
        }

        if (user.getRole() == null) {
            user.setRole(Role.TESTER); // default role
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // GET USER BY ID
    @Transactional(readOnly = true)
    public User getUserById(Long userId) {

        if (userId == null) {
            throw new BadRequestException("User ID cannot be null");
        }

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User with id " + userId + " not found"));
    }

    // GET ALL USERS
    @Transactional(readOnly = true)
    public List<User> getAll() {
        return userRepository.findAll();
    }

    // GET USERS BY ROLE
    @Transactional(readOnly = true)
    public List<User> getByRole(String role) {

        Role parsedRole = parseRole(role);
        return userRepository.findAllByRole(parsedRole);
    }

    // DELETE USER
    public void deleteUserById(Long userId) {

        User user = getUserById(userId);
        userRepository.delete(user);
    }

    // CHANGE USER ROLE
    public User changeRole(Long userId, String role) {

        Role newRole = parseRole(role);
        User user = getUserById(userId);

        if (user.getRole() == newRole) {
            throw new BadRequestException("User already has role " + newRole);
        }

        user.setRole(newRole);
        return userRepository.save(user);
    }

    // ----------------- Helper Methods -----------------

    private Role parseRole(String role) {

        if (isBlank(role)) {
            throw new BadRequestException("Role cannot be empty");
        }

        try {
            return Role.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid role: " + role);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
