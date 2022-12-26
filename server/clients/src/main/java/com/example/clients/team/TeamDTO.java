package com.example.clients.team;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.example.clients.jwt.UserCredentials;

public record TeamDTO(
        Integer id,
        Date createdAt,
        @NotNull String name,
        @NotNull String color,
        @NotNull UserCredentials owner,
        String avatar,
        Boolean isPrivate,
        List<SpaceDTO> spaces,
        List<UserCredentials> members) {
}
