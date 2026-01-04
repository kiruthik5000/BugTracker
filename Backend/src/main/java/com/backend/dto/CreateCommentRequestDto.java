package com.backend.dto;

import lombok.Data;

@Data
public class CreateCommentRequestDto {
    private Long bugId;
    private Long createdBy;
    private String message;
}
