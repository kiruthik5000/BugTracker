package com.backend.service;

import com.backend.dto.CreateProjectRequestDto;
import com.backend.dto.ProjectResponseDto;
import com.backend.entity.Project;
import com.backend.entity.Role;
import com.backend.entity.User;
import com.backend.exception.BadRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.mapper.ProjectMapper;
import com.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserService userService;

    public ProjectService(ProjectRepository projectRepository, UserService userService) {
        this.projectRepository = projectRepository;
        this.userService = userService;
    }


    // GET ALL PROJECTS
    @Transactional(readOnly = true)
    public List<ProjectResponseDto> getAll() {
        return ProjectMapper.toDto(projectRepository.findAll());
    }

    // CREATE PROJECT
    public ProjectResponseDto createProject(CreateProjectRequestDto projectRequestDto) {

        if (projectRequestDto == null) throw new BadRequestException("Project Cannot be Null");
        if (isBlank(projectRequestDto.getName())) throw new BadRequestException("Project Name required");
        User usr = userService.getUserById_helper(projectRequestDto.getUserId());
        Project project = ProjectMapper.toEntity(projectRequestDto, usr);
        return ProjectMapper.toDto(projectRepository.save(project));
    }

    // ASSIGN MANAGER
    public ProjectResponseDto assignProject(Long projectId, Long managerId) {
        Project project = getProjectById_helper(projectId);

        User manager = userService.getUserById_helper(managerId);

        if (manager.getRole() != Role.PROJECT_MANAGER) throw new BadRequestException("Only Project Manager can be assigned");
        project.setManagedBy(manager);
        return ProjectMapper.toDto(projectRepository.save(project));
    }

    // DELETE PROJECT
    public void deleteProject(Long projectId) {
        Project project = getProjectById_helper(projectId);
        projectRepository.delete(project);
    }

    // HELPER FUNCTIONS
    public Project getProjectById_helper(Long id) {
        if (id == null) throw new BadRequestException("Project ID cannot be null");

        return projectRepository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Project with id" + id + "Not found")
        );
    }
    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

}