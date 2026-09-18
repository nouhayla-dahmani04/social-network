package com.example.socialnetwork.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.socialnetwork.entity.EventResponse;

import java.util.List;

public interface EventResponseRepository extends JpaRepository<EventResponse, String>{
    
    Long countByEventIdAndResponse(String eventId, String response);

    List<EventResponse> findByEventIdAndUserId(String eventId, String userId);

    //findByEventId(...);

}
