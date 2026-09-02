package com.example.socialnetwork.controller;

import com.example.socialnetwork.dto.CreatePostRequest;
import com.example.socialnetwork.dto.PostResponse;
import com.example.socialnetwork.dto.UpdatePostRequest;
import com.example.socialnetwork.entity.User;
import com.example.socialnetwork.service.PostService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/users/{userId}/posts")
    public List<PostResponse> getUserPosts(
            @PathVariable String userId,
            @AuthenticationPrincipal User currentUser
    ) {
        return postService.getUserPosts(userId, currentUser);
    }

    @PostMapping("/posts")
    public PostResponse createPost(
            @RequestBody CreatePostRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        return postService.createPost(currentUser, req);
    }

    @PutMapping("/posts/{postId}")
    public PostResponse updatePost(
            @PathVariable String postId,
            @RequestBody UpdatePostRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        return postService.updatePost(postId, currentUser, req);
    }

    @DeleteMapping("/posts/{postId}")
    public void deletePost(
            @PathVariable String postId,
            @AuthenticationPrincipal User currentUser
    ) {
        postService.deletePost(postId, currentUser);
    }
}