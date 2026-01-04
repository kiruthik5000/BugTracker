package com.backend.controller;

import com.backend.entity.Bug;
import com.backend.service.BugService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    @PostMapping
    public ResponseEntity<?> createBug(@RequestBody Bug bug) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bugService.createBug(bug));
    }

    // DELETE BUG
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBug(@PathVariable Long id) {
        bugService.deleteBug(id);
        return ResponseEntity.noContent().build();
    }

    // ASSIGN BUG TO DEVELOPER
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignBugTo(
            @PathVariable Long id,
            @RequestParam Long userId) {

        return ResponseEntity.ok(bugService.assignBug(id, userId));
    }
}
