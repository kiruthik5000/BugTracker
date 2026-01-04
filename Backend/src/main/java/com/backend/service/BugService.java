package com.backend.service;

import com.backend.entity.Bug;
import com.backend.entity.BugStatus;
import com.backend.entity.Role;
import com.backend.entity.User;
import com.backend.exception.BadRequestException;
import com.backend.exception.ResourceNotFoundException;
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
    public Bug createBug(Bug bug) {

        if (bug == null) {
            throw new BadRequestException("Bug cannot be null");
        }

        if (isBlank(bug.getTitle())) {
            throw new BadRequestException("Bug title is required");
        }

        if (isBlank(bug.getStepsToReproduce())) {
            throw new BadRequestException("Steps to reproduce are required");
        }

        bug.setStatus(BugStatus.OPEN); // default status
        return bugRepository.save(bug);
    }

    // GET BUG BY ID
    @Transactional(readOnly = true)
    public Bug getBugById(Long bugId) {

        if (bugId == null) {
            throw new BadRequestException("Bug ID cannot be null");
        }

        return bugRepository.findById(bugId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Bug with id " + bugId + " not found"));
    }

    // GET ALL BUGS
    @Transactional(readOnly = true)
    public List<Bug> getAll() {
        return bugRepository.findAll();
    }

    // GET BUGS CREATED BY USER
    @Transactional(readOnly = true)
    public List<Bug> getCreatedBugs(Long userId) {

        if (userId == null) {
            throw new BadRequestException("User ID cannot be null");
        }

        return bugRepository.findByCreatedBy_Id(userId);
    }

    // GET BUGS ASSIGNED TO USER
    @Transactional(readOnly = true)
    public List<Bug> getAssignedBugs(Long userId) {

        if (userId == null) {
            throw new BadRequestException("User ID cannot be null");
        }

        return bugRepository.findAllByAssignedTo_Id(userId);
    }

    // DELETE BUG
    public void deleteBug(Long bugId) {

        Bug bug = getBugById(bugId);

        if (bug.getStatus() == BugStatus.CLOSED) {
            throw new BadRequestException("Closed bugs cannot be deleted");
        }
        bugRepository.delete(bug);
    }

    // ASSIGN BUG TO DEVELOPER
    public Bug assignBug(Long bugId, Long userId) {

        Bug bug = getBugById(bugId);

        if (bug.getStatus() == BugStatus.CLOSED) {
            throw new BadRequestException("Closed bugs cannot be reassigned");
        }

        User developer = userService.getUserById(userId);

        if (developer.getRole() != Role.DEVELOPER) {
            throw new BadRequestException("Only developers can be assigned bugs");
        }

        bug.setAssignedTo(developer);
        return bugRepository.save(bug);
    }

    // ---------------- Helper ----------------
    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
