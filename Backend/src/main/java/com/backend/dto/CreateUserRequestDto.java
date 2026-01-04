package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateUserRequestDto {
    private String username;
    private String email;
    private String role;
    private String password;
}
