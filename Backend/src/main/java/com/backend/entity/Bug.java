package com.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@Table(name = "bugs")
public class Bug extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, length = 4000)
    private String stepsToReproduce;

    @Enumerated(EnumType.STRING)
    private BugStatus status;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    // many bugs created by a single user
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    // many bugs assigned to a single user
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    // many bugs belong to a single project
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

}
