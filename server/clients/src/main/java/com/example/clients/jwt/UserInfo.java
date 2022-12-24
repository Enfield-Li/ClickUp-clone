package com.example.clients.jwt;

public record UserInfo(
        String email,
        Integer userId,
        String username) {
}
