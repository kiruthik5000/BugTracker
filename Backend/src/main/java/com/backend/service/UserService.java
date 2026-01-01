package com.backend.service;

import com.backend.entity.Role;
import com.backend.entity.User;
import com.backend.exception.BadRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.desktop.OpenFilesEvent;
import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // post
    public User createUser(User user) {
        if(user.getUsername() == null || user.getEmail() == null || user.getPassword() == null)
            throw new BadRequestException("Field cannot be empty");

        return userRepository.save(user);
    }
    // get
    public User getUserById(Long userId) {
        if(userId < 0 || userId >= Long.MAX_VALUE) throw new BadRequestException("invalid id");

        User user = userRepository.findById(userId).orElseThrow(
                ()->{throw new ResourceNotFoundException("user with id not found");}
        );
        return user;
    }

    // get all
    public List<User> getAll() {
        return userRepository.findAll();
    }

    // get by role
    public List<User> getByRole(String role) {
        Role role1 = null;
        try{
            role1 = Role.valueOf(role.toUpperCase());
        }catch (IllegalArgumentException e) {
            throw new BadRequestException("role not found");
        }
        return userRepository.findAllByRole(role1);
    }

    // delete user
    public User deleteUserById(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                ()->{throw new ResourceNotFoundException("user with id not found");}
        );
        userRepository.delete(user);
        return user;
    }

    // change roles
    public User changeRole(Long userId, String role) {
        Role role1 = null;
        try {
            role1 = Role.valueOf(role.toUpperCase());
        }catch (IllegalArgumentException e) {
            throw new BadRequestException("role is not found");
        }
        User user = userRepository.findById(userId).orElseThrow(
                ()->{throw new ResourceNotFoundException("user with id not found");}
        );
        user.setRole(role1);
        return userRepository.save(user);
    }
}
