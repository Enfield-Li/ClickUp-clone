package com.example.team.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.team.model.ListCategory;

@Repository
public interface ListCategoryRepository extends JpaRepository<ListCategory, Integer> {

}
