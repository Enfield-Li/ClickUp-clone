package com.example.clients.team;

import java.util.Date;
import java.util.List;

import javax.validation.constraints.NotNull;

import com.example.clients.jwt.UserInfo;

public record TeamDTO(
        Integer id,
        Date createdAt,
        @NotNull String name,
        @NotNull String color,
        @NotNull UserInfo owner,
        String avatar,
        Boolean isPrivate,
        List<SpaceDTO> spaces,
        List<UserInfo> members) {
}
