package com.example.socialnetwork.dto;

import com.example.socialnetwork.entity.PostPrivacy;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostResponse {

    private String id;

    private String content;

    private String imageUrl;

    private PostPrivacy privacy;

    private String authorId;

    private String authorFirstName;

    private String authorLastName;

    private String authorAvatarUrl;

    private String createdAt;
}