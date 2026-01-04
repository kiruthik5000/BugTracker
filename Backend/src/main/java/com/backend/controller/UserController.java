package com.backend.controller;

import com.backend.entity.User;
import com.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET ALL USERS
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    // GET USER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // GET USERS BY ROLE
    @GetMapping("/role/{role}")
    public ResponseEntity<?> getByRole(@PathVariable String role) {
        return ResponseEntity.ok(userService.getByRole(role));
    }

    // CREATE USER
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(userService.createUser(user));
    }

    // DELETE USER
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    // CHANGE USER ROLE
    @PatchMapping("/{id}/role")
    public ResponseEntity<?> changeRole(
            @PathVariable Long id,
            @RequestParam String role) {

        return ResponseEntity.ok(userService.changeRole(id, role));
    }
}
