package com.example.socialnetwork.repository;

import com.example.socialnetwork.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, String> {

    boolean existsByFollowerIdAndFolloweeIdAndStatus(
            String followerId, String followeeId, String status);
}