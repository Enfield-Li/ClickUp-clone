package com.example.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationUserRepository
        extends JpaRepository<ApplicationUser, Integer> {
    public Boolean existsByUsername(String username);

    public Boolean existsByEmail(String email);

    public Optional<ApplicationUser> findByUsername(String username);
    public Optional<ApplicationUser> findByEmail(String email);
}
