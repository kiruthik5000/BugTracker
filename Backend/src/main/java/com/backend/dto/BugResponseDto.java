package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class BugResponseDto {

    private Long id;
    private String title;
    private String status;
    private String stepsToReproduce;
    private String priority;
    private String createdBy;
    private String assignedTo;
    private String projectName;
    private LocalDateTime createdAt;
}
