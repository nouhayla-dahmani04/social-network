package com.example.socialnetwork.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.socialnetwork.entity.GroupMember;

import java.util.List;

public interface GroupMemberRepository extends JpaRepository<GroupMember, String>{
    boolean existsByGroupIdAndUserIdAndStatus(String groupId, String userId, String status);
        //    findByGroupIdAndUserId(...)
    List<GroupMember> findByGroupIdAndStatus(String groupId, String status);
         //   findByUserIdAndStatus(...)
    Long countByGroupIdAndStatus(String groupId, String status);
    void deleteByGroupIdAndUserId(String groupId, String userId);
}
