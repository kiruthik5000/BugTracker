package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateBugRequestDto {
    private String title;
    private String description;
    private String stepsToReproduce;
    private String status;
    private String priority;
    private Long createdBy;
}
