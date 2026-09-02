package com.example.socialnetwork.controller;

import com.example.socialnetwork.dto.CommentResponse;
import com.example.socialnetwork.dto.CreateCommentRequest;
import com.example.socialnetwork.dto.UpdateCommentRequest;
import com.example.socialnetwork.entity.User;
import com.example.socialnetwork.service.CommentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/posts/{postId}/comments")
    public List<CommentResponse> getComments(
            @PathVariable String postId,
            @AuthenticationPrincipal User currentUser
    ) {
        return commentService.getCommentsForPost(postId, currentUser);
    }

    @PostMapping("/posts/{postId}/comments")
    public CommentResponse createComment(
            @PathVariable String postId,
            @RequestBody CreateCommentRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        return commentService.createComment(postId, currentUser, req);
    }

    @PutMapping("/comments/{commentId}")
    public CommentResponse updateComment(
            @PathVariable String commentId,
            @RequestBody UpdateCommentRequest req,
            @AuthenticationPrincipal User currentUser
    ) {
        return commentService.updateComment(commentId, currentUser, req);
    }

    @DeleteMapping("/comments/{commentId}")
    public void deleteComment(
            @PathVariable String commentId,
            @AuthenticationPrincipal User currentUser
    ) {
        commentService.deleteComment(commentId, currentUser);
    }
}