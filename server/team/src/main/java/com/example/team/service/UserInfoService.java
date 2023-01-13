package com.example.team.service;

import javax.persistence.EntityManager;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.clients.jwt.UserCredentials;
import com.example.team.model.UserInfo;
import com.example.team.repository.UserInfoRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserInfoService {

    private final EntityManager entityManager;
    private final UserInfoRepository repository;

    private UserCredentials getUserCredentialsInfo() {
        // return new UserCredentials(1, "username");
        return (UserCredentials) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    @Transactional
    public UserInfo getCurrentUserInfo() {
        var userCredentials = getUserCredentialsInfo();
        var userId = userCredentials.userId();
        var username = userCredentials.username();

        var isUserInfoPersisted = repository.existsById(userId);

        if (!isUserInfoPersisted) {
            return UserInfo.builder()
                    .userId(userId).username(username).build();
        }

        return entityManager.getReference(UserInfo.class, userId);
    }
}
