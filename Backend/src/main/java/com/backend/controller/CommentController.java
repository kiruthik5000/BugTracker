package com.backend.controller;

import com.backend.entity.Comment;
import com.backend.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // GET COMMENTS BY BUG ID
    @GetMapping("/bug/{bugId}")
    public ResponseEntity<?> getCommentsByBug(@PathVariable Long bugId) {
        return ResponseEntity.ok(commentService.getCommentByBug(bugId));
    }

    // CREATE COMMENT
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody Comment comment) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(commentService.postComment(comment));
    }
}
