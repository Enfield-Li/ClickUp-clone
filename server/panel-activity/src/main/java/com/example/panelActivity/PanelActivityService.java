package com.example.panelActivity;

import org.springframework.stereotype.Service;

import com.example.clients.jwt.UserInfo;
import com.example.panelActivity.dto.CreatePanelActivityDTO;
import com.example.panelActivity.model.PanelActivity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PanelActivityService {

    private final PanelActivityRepository panelActivityRepository;

    UserInfo userInfo = new UserInfo("mockUser@gmail.com", 1, "mockUser");

    public Boolean createStatusColumn(
            CreatePanelActivityDTO createPanelActivityDTO) {
        var teamId = createPanelActivityDTO.teamId();
        var spaceId = createPanelActivityDTO.spaceId();

        var panelActivity = PanelActivity
                .initPanelActivity(userInfo.userId(), teamId, spaceId);
        panelActivityRepository.save(panelActivity);
        return true;
    }
}
