package com.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "comments")
public class Comment extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // many comments to a single bug
    @ManyToOne(optional = false)
    @JoinColumn(name = "bug_id")
    private Bug bug;

    // many comments by a single user over the period of time
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 1000)
    private String message;
}
