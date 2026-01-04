package com.backend.controller;

import com.backend.dto.CreateBugRequestDto;
import com.backend.entity.Bug;
import com.backend.service.BugService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bugs")
public class BugController {

    private final BugService bugService;

    public BugController(BugService bugService) {
        this.bugService = bugService;
    }

    // GET ALL BUGS
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(bugService.getAll());
    }

    // GET BUG BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bugService.getBugById(id));
    }

    // GET BUGS CREATED BY USER
    @GetMapping("/user/{id}/created")
    public ResponseEntity<?> getByUserCreated(@PathVariable Long id) {
        return ResponseEntity.ok(bugService.getCreatedBugs(id));
    }

    // GET BUGS ASSIGNED TO USER
    @GetMapping("/user/{id}/assigned")
    public ResponseEntity<?> getAssignedBugs(@PathVariable Long id) {
        return ResponseEntity.ok(bugService.getAssignedBugs(id));
    }

    // CREATE BUG
    @PreAuthorize("hasRole('TESTER')")
    @PostMapping
    public ResponseEntity<?> createBug(@RequestBody CreateBugRequestDto bug, @RequestParam Long createdBy) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bugService.createBug(bug, createdBy));
    }

    // DELETE BUG
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBug(@PathVariable Long id) {
        bugService.deleteBug(id);
        return ResponseEntity.noContent().build();
    }

    // ASSIGN BUG TO DEVELOPER
    @PreAuthorize("hasAnyRole('PROJECT_MANAGER', 'ADMIN')")
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignBugTo(
            @PathVariable Long id,
            @RequestParam Long userId) {

        return ResponseEntity.ok(bugService.assignBug(id, userId));
    }

    // Change status
    @PreAuthorize("hasAnyRole('DEVELOPER', 'PROJECT_MANAGER')")
    @PutMapping("/{id}/changeStatus")
    public ResponseEntity<?> changeStatus(
            @PathVariable Long id,
            @RequestParam String changeTo) {
        return ResponseEntity.ok(bugService.changeStatus(id, changeTo));
    }
}


