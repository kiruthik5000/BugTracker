package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ProjectResponseDto {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private String assignedTo;
}
