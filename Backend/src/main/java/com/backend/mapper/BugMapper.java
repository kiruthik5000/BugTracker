package com.backend.mapper;


import com.backend.dto.BugResponseDto;
import com.backend.dto.CreateBugRequestDto;
import com.backend.entity.Bug;
import com.backend.entity.BugStatus;
import com.backend.entity.Priority;
import com.backend.entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class BugMapper {

    public static Bug toEntity(CreateBugRequestDto dto, User createdBy) {
        Bug bug = new Bug();
        bug.setTitle(dto.getTitle());
        bug.setDescription(dto.getDescription());
        bug.setStepsToReproduce(dto.getStepsToReproduce());
        bug.setPriority(Priority.valueOf(dto.getPriority()));
        bug.setStatus(BugStatus.OPEN);
        bug.setCreatedBy(createdBy);
        bug.setCreatedAt(LocalDateTime.now());
        return bug;
    }

    public static BugResponseDto toDto(Bug bug) {
        return new BugResponseDto(
                bug.getId(),
                bug.getTitle(),
                bug.getStatus().name(),
                bug.getStepsToReproduce(),
                bug.getPriority().name(),
                bug.getCreatedBy().getUsername(),
                bug.getAssignedTo() != null ? bug.getAssignedTo().getUsername() : null,
                bug.getCreatedAt()
        );
    }
    public static List<BugResponseDto> toDto(List<Bug> bugs) {
        if (bugs == null || bugs.isEmpty()) {
            return List.of();
        }
        List<BugResponseDto> responseDtos = new ArrayList<>();
        for (Bug bug : bugs) {
            responseDtos.add(toDto(bug));
        }
        return responseDtos;
    }

}
