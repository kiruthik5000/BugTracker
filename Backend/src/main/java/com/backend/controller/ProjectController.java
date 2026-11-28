package com.backend.controller;

import com.backend.dto.AssignProjectsRequestDto;
import com.backend.dto.CreateProjectRequestDto;
import com.backend.security.CustomUserDetails;
import com.backend.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // GET ALL PROJECTS
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(projectService.getAll());
    }

    // GET PROJECTS BY MANAGER
    @GetMapping("/manager/{managerId}")
    public ResponseEntity<?> getProjectsByManager(@PathVariable Long managerId) {
        return ResponseEntity.ok(projectService.getProjectsByManager(managerId));
    }

    // GET PROJECTS MANAGED BY CURRENT USER
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    @GetMapping("/my-projects")
    public ResponseEntity<?> getMyProjects(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(projectService.getProjectsByManager(userDetails.getUser().getId()));
    }

    // CREATE PROJECT
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody CreateProjectRequestDto project) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(projectService.createProject(project));
    }

    // ASSIGN MANAGER TO PROJECT
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignManager(
            @PathVariable Long id,
            @RequestParam Long managerId) {
        return ResponseEntity.ok(projectService.assignProject(id, managerId));
    }

    // ASSIGN MULTIPLE PROJECTS TO A SINGLE PROJECT MANAGER
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/assign")
    public ResponseEntity<?> assignProjects(@RequestBody AssignProjectsRequestDto request) {
        return ResponseEntity.ok(
                projectService.assignProjectsToManager(request.getManagerId(), request.getProjectIds())
        );
    }

    // ASSIGN MULTIPLE PROJECTS TO A SPECIFIC PROJECT MANAGER
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/manager/{managerId}/assign")
    public ResponseEntity<?> assignProjectsToManager(
            @PathVariable Long managerId,
            @RequestBody List<Long> projectIds) {
        return ResponseEntity.ok(projectService.assignProjectsToManager(managerId, projectIds));
    }

    // DELETE PROJECT
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
