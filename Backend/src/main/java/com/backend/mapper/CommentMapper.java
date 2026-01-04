package com.backend.mapper;


import com.backend.dto.CommentResponseDto;
import com.backend.dto.CreateCommentRequestDto;
import com.backend.entity.Bug;
import com.backend.entity.Comment;
import com.backend.entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class CommentMapper {

    public static Comment toEntity(CreateCommentRequestDto dto, Bug bug, User user) {
        Comment comment = new Comment();
        comment.setBug(bug);
        comment.setMessage(dto.getMessage());
        comment.setUser(user);
        comment.setCreatedAt(LocalDateTime.now());
        return comment;
    }

    public static CommentResponseDto toDto(Comment comment) {
        return new CommentResponseDto(
                comment.getId(),
                comment.getMessage(),
                comment.getUser().getUsername(),
                comment.getCreatedAt()
        );
    }
    public static List<CommentResponseDto> toDto(List<Comment> comments) {
        if(comments == null || comments.isEmpty()) return List.of();

        List<CommentResponseDto> responseDtos = new ArrayList<>();

        for (Comment comment : comments) responseDtos.add(toDto(comment));
        return responseDtos;
    }
}
