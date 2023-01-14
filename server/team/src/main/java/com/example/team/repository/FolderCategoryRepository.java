package com.example.team.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.team.model.FolderCategory;

@Repository
public interface FolderCategoryRepository extends JpaRepository<FolderCategory, Integer> {

}
