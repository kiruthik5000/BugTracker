package com.backend.service;

import com.backend.dto.BugResponseDto;
import com.backend.dto.CreateBugRequestDto;
import com.backend.entity.Bug;
import com.backend.entity.BugStatus;
import com.backend.entity.Role;
import com.backend.entity.User;
import com.backend.exception.BadRequestException;
import com.backend.exception.ResourceNotFoundException;
import com.backend.mapper.BugMapper;
import com.backend.repository.BugRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class BugService {

    private final BugRepository bugRepository;
    private final UserService userService;

    public BugService(BugRepository bugRepository, UserService userService) {
        this.bugRepository = bugRepository;
        this.userService = userService;
    }

    // CREATE BUG
    public BugResponseDto createBug(CreateBugRequestDto bug, Long createdBy) {

        if (bug == null) {
            throw new BadRequestException("Bug cannot be null");
        }

        if (isBlank(bug.getTitle())) {
            throw new BadRequestException("Bug title is required");
        }

        if (isBlank(bug.getStepsToReproduce())) {
            throw new BadRequestException("Steps to reproduce are required");
        }
        User user = userService.getUserById_helper(createdBy);
        return BugMapper.toDto(bugRepository.save(BugMapper.toEntity(bug, user)));
    }

    // GET BUG BY ID
    @Transactional(readOnly = true)
    public BugResponseDto getBugById(Long bugId) {

       return BugMapper.toDto(getBugById_helper(bugId));
    }

    // GET ALL BUGS
    @Transactional(readOnly = true)
    public List<BugResponseDto> getAll() {
        return BugMapper.toDto(bugRepository.findAll());
    }

    // GET BUGS CREATED BY USER
    @Transactional(readOnly = true)
    public List<BugResponseDto> getCreatedBugs(Long userId) {

        if (userId == null) {
            throw new BadRequestException("User ID cannot be null");
        }

        return BugMapper.toDto(bugRepository.findByCreatedBy_Id(userId));
    }

    // GET BUGS ASSIGNED TO USER
    @Transactional(readOnly = true)
    public List<BugResponseDto> getAssignedBugs(Long userId) {

        if (userId == null) {
            throw new BadRequestException("User ID cannot be null");
        }

        return BugMapper.toDto(bugRepository.findAllByAssignedTo_Id(userId));
    }

    // DELETE BUG
    public void deleteBug(Long bugId) {

        Bug bug = getBugById_helper(bugId);

        if (bug.getStatus() == BugStatus.CLOSED) {
            throw new BadRequestException("Closed bugs cannot be deleted");
        }
        bugRepository.delete(bug);
    }

    // ASSIGN BUG TO DEVELOPER
    public BugResponseDto assignBug(Long bugId, Long userId) {

        Bug bug = getBugById_helper(bugId);

        if (bug.getStatus() == BugStatus.CLOSED) {
            throw new BadRequestException("Closed bugs cannot be reassigned");
        }

        User developer = userService.getUserById_helper(userId);

        if (developer.getRole() != Role.DEVELOPER) {
            throw new BadRequestException("Only developers can be assigned bugs");
        }

        bug.setAssignedTo(developer);
        return BugMapper.toDto(bugRepository.save(bug));
    }

    // change the status
    public BugResponseDto changeStatus(Long bugId, String changeTo) {
        Bug bug = getBugById_helper(bugId);
        try {
            BugStatus newStatus = BugStatus.valueOf(changeTo);
            bug.setStatus(newStatus);
            bugRepository.save(bug);
        }catch (Exception e) {
            throw new BadRequestException("status not available");
        }
        return BugMapper.toDto(bug);
    }

    // ---------------- Helper ----------------
    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    public Bug getBugById_helper(Long bugId) {

        if (bugId == null) {
            throw new BadRequestException("Bug ID cannot be null");
        }

        return bugRepository.findById(bugId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bug with id " + bugId + " not found"));
    }
}
