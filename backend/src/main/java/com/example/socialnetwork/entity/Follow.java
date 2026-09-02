package com.example.socialnetwork.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

// Cette classe représente une ligne de la table "follows"
// Elle dit : "follower_id suit followee_id, avec un statut (pending/accepted)"
@Entity
@Table(name = "follows")
@Getter @Setter
public class Follow {

    @Id
    private String id = UUID.randomUUID().toString();

    @Column(name = "follower_id", nullable = false)
    private String followerId; // celui qui suit

    @Column(name = "followee_id", nullable = false)
    private String followeeId; // celui qui est suivi

    @Column(nullable = false)
    private String status = "pending"; // "pending" ou "accepted"

    @Column(name = "created_at", insertable = false, updatable = false)
    private String createdAt;
}