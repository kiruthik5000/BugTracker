package com.backend.service;

import com.backend.dto.ProjectResponseDto;
import com.backend.entity.Project;
import com.backend.entity.Role;
import com.backend.entity.User;
import com.backend.exception.BadRequestException;
import com.backend.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

class ProjectServiceTest {

    private ProjectRepository projectRepository;
    private UserService userService;
    private ProjectService projectService;

    private User projectManager;
    private User developer;
    private Project project1;
    private Project project2;

    @BeforeEach
    void setUp() {
        projectRepository = mock(ProjectRepository.class);
        userService = mock(UserService.class);
        projectService = new ProjectService(projectRepository, userService);

        projectManager = new User();
        projectManager.setId(10L);
        projectManager.setUsername("pm_alice");
        projectManager.setRole(Role.PROJECT_MANAGER);

        developer = new User();
        developer.setId(20L);
        developer.setUsername("dev_bob");
        developer.setRole(Role.DEVELOPER);

        project1 = new Project();
        project1.setId(1L);
        project1.setName("Alpha");
        project1.setDescription("Alpha project");
        project1.setCreatedAt(LocalDateTime.now());

        project2 = new Project();
        project2.setId(2L);
        project2.setName("Beta");
        project2.setDescription("Beta project");
        project2.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void assignProjectsToManagerAssignsMultipleProjectsToSingleManager() {
        when(userService.getUserById_helper(10L)).thenReturn(projectManager);
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project1));
        when(projectRepository.findById(2L)).thenReturn(Optional.of(project2));
        when(projectRepository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        List<ProjectResponseDto> result = projectService.assignProjectsToManager(10L, List.of(1L, 2L));

        assertEquals(2, result.size());
        assertEquals("pm_alice", result.get(0).getAssignedTo());
        assertEquals(10L, result.get(0).getManagerId());
        assertEquals("pm_alice", result.get(1).getAssignedTo());
        assertEquals(10L, result.get(1).getManagerId());
        assertEquals(projectManager, project1.getManagedBy());
        assertEquals(projectManager, project2.getManagedBy());
        verify(projectRepository).saveAll(List.of(project1, project2));
    }

    @Test
    void assignProjectsToManagerRejectsNonProjectManager() {
        when(userService.getUserById_helper(20L)).thenReturn(developer);

        assertThrows(BadRequestException.class,
                () -> projectService.assignProjectsToManager(20L, List.of(1L, 2L)));
        verify(projectRepository, never()).saveAll(anyList());
    }

    @Test
    void assignProjectsToManagerRejectsEmptyProjectList() {
        assertThrows(BadRequestException.class,
                () -> projectService.assignProjectsToManager(10L, List.of()));
        verify(projectRepository, never()).saveAll(anyList());
    }

    @Test
    void getProjectsByManagerReturnsAllManagedProjects() {
        project1.setManagedBy(projectManager);
        project2.setManagedBy(projectManager);
        when(userService.getUserById_helper(10L)).thenReturn(projectManager);
        when(projectRepository.findAllByManagedBy_Id(10L)).thenReturn(List.of(project1, project2));

        List<ProjectResponseDto> result = projectService.getProjectsByManager(10L);

        assertEquals(2, result.size());
        assertEquals("Alpha", result.get(0).getName());
        assertEquals("Beta", result.get(1).getName());
        assertEquals(10L, result.get(0).getManagerId());
        assertEquals(10L, result.get(1).getManagerId());
    }
}
