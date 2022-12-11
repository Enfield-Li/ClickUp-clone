package com.example.panelActivity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.panelActivity.model.PanelActivity;

@Repository
public interface PanelActivityRepository
        extends JpaRepository<PanelActivity, Integer> {
}
