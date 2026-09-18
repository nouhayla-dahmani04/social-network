package com.example.socialnetwork.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.socialnetwork.entity.EventResponse;

import java.util.List;
import java.util.Optional;

public interface EventResponseRepository extends JpaRepository<EventResponse, String>{
    
    Long countByEventIdAndResponse(String eventId, String response);

    Optional<EventResponse> findByEventIdAndUserId(String eventId, String userId);

    List<EventResponse> findByEventId(String eventId);

}
