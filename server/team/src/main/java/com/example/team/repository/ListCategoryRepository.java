package com.example.team.repository;

import com.example.team.model.ListCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListCategoryRepository
        extends JpaRepository<ListCategory, Integer> {

    Boolean existsByNameAndSpaceIdAndParentFolderId(
            String name, Integer spaceId, Integer parentFolderId);
}
