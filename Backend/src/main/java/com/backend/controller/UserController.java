package com.backend.controller;

import com.backend.entity.User;
import com.backend.service.UserService;
import org.apache.coyote.Request;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getall")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(userService.getAll());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/get/{role}")
    public ResponseEntity<?> getByRole(@PathVariable String role) {
        return ResponseEntity.ok(userService.getByRole(role));
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.deleteUserById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> changeRole(@PathVariable Long id, @RequestParam String role) {
        return ResponseEntity.ok(userService.changeRole(id, role));
    }
}

