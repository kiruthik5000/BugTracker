package com.backend.mapper;

import com.backend.dto.CreateProjectRequestDto;
import com.backend.dto.ProjectResponseDto;
import com.backend.entity.Project;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ProjectMapper {

    public static Project toEntity(CreateProjectRequestDto dto) {
        Project project = new Project();
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setCreatedAt(LocalDateTime.now());
        return project;
    }

    public static ProjectResponseDto toDto(Project project) {
        return new ProjectResponseDto(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getCreatedAt(),
                project.getManagedBy() != null ? project.getManagedBy().getUsername() : null
        );
    }

    public static List<ProjectResponseDto> toDto(List<Project> projectList) {
        if (projectList == null || projectList.isEmpty()) return List.of();
        List<ProjectResponseDto> responseDtos = new ArrayList<>();
        for(Project project : projectList) {
            responseDtos.add(toDto(project));
        }
        return responseDtos;
    }
}
