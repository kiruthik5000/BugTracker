package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateProjectRequestDto {
    private String name;
    private String description;
}
