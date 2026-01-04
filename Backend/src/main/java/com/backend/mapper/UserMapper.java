package com.backend.mapper;


import com.backend.dto.CreateUserRequestDto;
import com.backend.dto.UserResponseDto;
import com.backend.entity.Role;
import com.backend.entity.User;

import java.util.ArrayList;
import java.util.List;

public class UserMapper {

    public static User toEntity(CreateUserRequestDto dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // encode in service
        if(dto.getRole() == null) {
            user.setRole(Role.TESTER); // default role
        }else {
            user.setRole(Role.valueOf(dto.getRole()));
        }
        return user;
    }

    public static UserResponseDto toDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getRole().name()
        );
    }
    public static List<UserResponseDto> toDto(List<User> users) {
        if (users == null || users.isEmpty()) {
            return List.of();
        }

        List<UserResponseDto> responseDtos = new ArrayList<>();
        for (User user : users) {
            responseDtos.add(toDto(user));
        }
        return responseDtos;
    }

}
