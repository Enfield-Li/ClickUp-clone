package com.example.task.service;

import com.example.clients.jwt.UserCredentials;
import com.example.task.model.UserInfo;
import com.example.task.repository.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserInfoService {

    private final EntityManager entityManager;
    private final UserInfoRepository repository;

    private UserCredentials getUserCredentialsInfo() {
        return (UserCredentials) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    public UserInfo getCurrentUserInfo() {
        var userCredentials = getUserCredentialsInfo();
        var userId = userCredentials.userId();
        var username = userCredentials.username();

        return repository.findByUserId(userId).orElse(
                UserInfo.builder()
                        .userId(userId).username(username).build());
    }
}
