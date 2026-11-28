package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponseDto {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private String assignedTo;
    private Long managerId;

    public ProjectResponseDto(Long id, String name, String description, LocalDateTime createdAt, String assignedTo) {
        this(id, name, description, createdAt, assignedTo, null);
    }
}
