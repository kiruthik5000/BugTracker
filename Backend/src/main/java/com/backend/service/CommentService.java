package com.backend.service;

import com.backend.dto.CommentResponseDto;
import com.backend.dto.CreateCommentRequestDto;
import com.backend.entity.Bug;
import com.backend.entity.Comment;
import com.backend.entity.User;
import com.backend.exception.BadRequestException;
import com.backend.mapper.CommentMapper;
import com.backend.repository.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserService userService;
    private final BugService bugService;
    public CommentService(CommentRepository commentRepository, UserService userService, BugService bugService) {
        this.commentRepository = commentRepository;
        this.bugService=bugService;
        this.userService=userService;
    }

    // GET COMMENTS BY BUG ID
    @Transactional(readOnly = true)
    public List<CommentResponseDto> getCommentByBug(Long bugId) {

        if (bugId == null) {
            throw new BadRequestException("Bug ID cannot be null");
        }

        return CommentMapper.toDto(commentRepository.findAllByBug_Id(bugId));
    }

    // POST COMMENT
    public CommentResponseDto postComment(CreateCommentRequestDto comment, Long createdBy, Long bugId) {

        if (comment == null) {
            throw new BadRequestException("Comment cannot be null");
        }
        Bug bug = bugService.getBugById_helper(bugId);

       User created = userService.getUserById_helper(createdBy);

        if (comment.getMessage() == null || comment.getMessage().trim().isEmpty()) {
            throw new BadRequestException("Comment message cannot be empty");
        }
        Comment request = CommentMapper.toEntity(comment, bug, created);
        return CommentMapper.toDto(commentRepository.save(request));
    }
}
