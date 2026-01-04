package com.backend.service;

import com.backend.dto.CreateUserRequestDto;
import com.backend.dto.UserResponseDto;
import com.backend.entity.Role;
import com.backend.entity.User;
import com.backend.exception.BadRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.mapper.UserMapper;
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
    public UserResponseDto createUser(CreateUserRequestDto dto) {

        if (dto == null) {
            throw new BadRequestException("User cannot be null");
        }

        if (isBlank(dto.getUsername()) ||
                isBlank(dto.getEmail()) ||
                isBlank(dto.getPassword())) {

            throw new BadRequestException("Username, email, and password are required");
        }
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        User user = UserMapper.toEntity(dto);

        if (user.getRole() == null) {
            user.setRole(Role.TESTER); // default role
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return UserMapper.toDto(user);
    }

    // GET USER BY ID
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long userId) {
        return UserMapper.toDto(getUserById_helper(userId));
    }

    // GET ALL USERS
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAll() {
        return UserMapper.toDto(userRepository.findAll());
    }

    // GET USERS BY ROLE
    @Transactional(readOnly = true)
    public List<UserResponseDto> getByRole(String role) {

        Role parsedRole = parseRole(role);
        return UserMapper.toDto(userRepository.findAllByRole(parsedRole));
    }

    // DELETE USER
    public void deleteUserById(Long userId) {

        User user = getUserById_helper(userId);
        userRepository.delete(user);
    }

    // CHANGE USER ROLE
    public UserResponseDto changeRole(Long userId, String role) {

        Role newRole = parseRole(role);
        User user = getUserById_helper(userId);

        if (user.getRole() == newRole) {
            throw new BadRequestException("User already has role " + newRole);
        }

        user.setRole(newRole);
        return UserMapper.toDto(userRepository.save(user));
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
    public User getUserById_helper(Long userId) {

        if (userId == null) {
            throw new BadRequestException("User ID cannot be null");
        }

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User with id " + userId + " not found"));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
