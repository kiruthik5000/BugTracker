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

import java.util.ArrayList;
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

    // GET PROJECTS BY MANAGER
    @Transactional(readOnly = true)
    public List<ProjectResponseDto> getProjectsByManager(Long managerId) {
        userService.getUserById_helper(managerId);
        return ProjectMapper.toDto(projectRepository.findAllByManagedBy_Id(managerId));
    }

    // CREATE PROJECT
    public ProjectResponseDto createProject(CreateProjectRequestDto projectRequestDto) {

        if (projectRequestDto == null) throw new BadRequestException("Project Cannot be Null");
        if (isBlank(projectRequestDto.getName())) throw new BadRequestException("Project Name required");
        User usr = projectRequestDto.getUserId() != null
                ? userService.getUserById_helper(projectRequestDto.getUserId())
                : null;
        Project project = ProjectMapper.toEntity(projectRequestDto, usr);
        return ProjectMapper.toDto(projectRepository.save(project));
    }

    // ASSIGN MANAGER TO SINGLE PROJECT
    public ProjectResponseDto assignProject(Long projectId, Long managerId) {
        Project project = getProjectById_helper(projectId);
        User manager = getValidatedProjectManager(managerId);

        project.setManagedBy(manager);
        return ProjectMapper.toDto(projectRepository.save(project));
    }

    // ASSIGN MULTIPLE PROJECTS TO A SINGLE PROJECT MANAGER
    public List<ProjectResponseDto> assignProjectsToManager(Long managerId, List<Long> projectIds) {
        if (projectIds == null || projectIds.isEmpty()) {
            throw new BadRequestException("Project IDs cannot be null or empty");
        }

        User manager = getValidatedProjectManager(managerId);

        List<Project> projectsToUpdate = new ArrayList<>();
        for (Long projectId : projectIds) {
            Project project = getProjectById_helper(projectId);
            project.setManagedBy(manager);
            projectsToUpdate.add(project);
        }

        return ProjectMapper.toDto(projectRepository.saveAll(projectsToUpdate));
    }

    // DELETE PROJECT
    public void deleteProject(Long projectId) {
        Project project = getProjectById_helper(projectId);
        projectRepository.delete(project);
    }

    // HELPER FUNCTIONS
    private User getValidatedProjectManager(Long managerId) {
        User manager = userService.getUserById_helper(managerId);
        if (manager.getRole() != Role.PROJECT_MANAGER) {
            throw new BadRequestException("Only Project Manager can be assigned");
        }
        return manager;
    }

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