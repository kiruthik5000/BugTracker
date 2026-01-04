package com.backend.service;

import com.backend.entity.Comment;
import com.backend.exception.BadRequestException;
import com.backend.repository.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    // GET COMMENTS BY BUG ID
    @Transactional(readOnly = true)
    public List<Comment> getCommentByBug(Long bugId) {

        if (bugId == null) {
            throw new BadRequestException("Bug ID cannot be null");
        }

        return commentRepository.findAllByBug_Id(bugId);
    }

    // POST COMMENT
    public Comment postComment(Comment comment) {

        if (comment == null) {
            throw new BadRequestException("Comment cannot be null");
        }

        if (comment.getBug() == null) {
            throw new BadRequestException("Bug reference cannot be null");
        }

        if (comment.getUser() == null) {
            throw new BadRequestException("User reference cannot be null");
        }

        if (comment.getMessage() == null || comment.getMessage().trim().isEmpty()) {
            throw new BadRequestException("Comment message cannot be empty");
        }

        return commentRepository.save(comment);
    }
}
