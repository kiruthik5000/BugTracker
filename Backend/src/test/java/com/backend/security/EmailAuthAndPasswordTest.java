package com.backend.security;

import com.backend.config.PasswordConfig;
import com.backend.entity.Role;
import com.backend.entity.User;
import com.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmailAuthAndPasswordTest {

    private UserRepository userRepository;
    private CustomUserDetailsService userDetailsService;
    private PasswordEncoder passwordEncoder;
    private DaoAuthenticationProvider authenticationProvider;
    private JwtUtil jwtUtil;

    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        userDetailsService = new CustomUserDetailsService(userRepository);
        passwordEncoder = new PasswordConfig().passwordEncoder();

        authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);

        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secretKey", "6f3a9c2e7b1d4a8f9e5c0b6a2d1f8c7e9a4b0d3f6e5a7c8b1d9e2f4a6c5");

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("john_doe");
        testUser.setEmail("john@example.com");
        testUser.setPassword(passwordEncoder.encode("Secret@123"));
        testUser.setRole(Role.TESTER);
        testUser.setEnabled(true);
    }

    @Test
    void jwtTokenUsesEmailAsSubjectAndValidatesAgainstUserDetails() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));

        UserDetails userDetails = userDetailsService.loadUserByUsername("john@example.com");
        assertEquals("john@example.com", userDetails.getUsername());

        String token = jwtUtil.generateToken(testUser.getEmail(), testUser.getRole().name());
        assertEquals("john@example.com", jwtUtil.extractEmail(token));
        assertTrue(jwtUtil.validateToken(token, userDetails));
    }

    @Test
    void authenticationSucceedsWithValidEmailAndPassword() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));

        Authentication auth = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken("john@example.com", "Secret@123")
        );

        assertTrue(auth.isAuthenticated());
        assertEquals("john@example.com", auth.getName());
    }

    @Test
    void authenticationFailsWithWrongPassword() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));

        assertThrows(BadCredentialsException.class, () ->
                authenticationProvider.authenticate(
                        new UsernamePasswordAuthenticationToken("john@example.com", "WrongPassword")
                )
        );
    }

    @Test
    void loadUserByUsernameThrowsWhenEmailNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () ->
                userDetailsService.loadUserByUsername("missing@example.com")
        );
    }
}
