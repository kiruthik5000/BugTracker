package com.backend.controller;

import com.backend.dto.CreateProjectRequestDto;
import com.backend.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    // DELETE PROJECT
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
