package com.example.panelActivity.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.clients.jwt.UserInfo;
import com.example.clients.panelActivity.UpdateDefaultTeamDTO;
import com.example.panelActivity.exception.InternalDataIntegrityException;
import com.example.panelActivity.exception.InvalidRequestException;
import com.example.panelActivity.model.PanelActivity;
import com.example.panelActivity.model.TeamActivity;
import com.example.panelActivity.repository.PanelActivityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class PanelActivityService {

    private final PanelActivityRepository panelActivityRepository;

    @Transactional
    public Boolean updateDefaultTeam(
            UpdateDefaultTeamDTO updatePanelActivityDTO) {
        UserInfo userInfo = new UserInfo(1, "mockUser");
        var userId = userInfo.userId();
        var teamId = updatePanelActivityDTO.teamId();
        var spaceId = updatePanelActivityDTO.spaceId();

        var optionalPanelActivity = panelActivityRepository.findByUserId(userId);
        if (optionalPanelActivity.isPresent()) {
            var panelActivity = optionalPanelActivity.get();
            var newTeamActivity = TeamActivity.builder()
                    .teamId(teamId)
                    .spaceId(spaceId)
                    .build();

            panelActivity.setDefaultTeamId(teamId);
            panelActivity.getTeamActivities().add(newTeamActivity);
            return true;
        }

        // init
        var panelActivity = PanelActivity
                .initPanelActivity(userId, teamId, spaceId);

        panelActivityRepository.save(panelActivity);
        return true;
    }

    public PanelActivity getPanelActivity(Integer userId) {
        var panelActivity = panelActivityRepository.findByUserId(userId)
                .orElseThrow(() -> new InvalidRequestException(
                        "Invalid request, because either"
                                + "1. User's workspace activity has yet been initialized"
                                + "or 2. user no longer exists."));

        validatePanelActivity(panelActivity);
        return panelActivity;
    }

    private void validatePanelActivity(PanelActivity panelActivity) {
        panelActivity.getTeamActivities().stream()
                .filter(teamActivity -> teamActivity.getTeamId()
                        .equals(panelActivity.getDefaultTeamId()))
                .findAny()
                .orElseThrow(() -> new InternalDataIntegrityException(
                        "PanelActivity data integrity breached, this really shouldn't happen..."));
    }

    private void validateSpaceId(Integer spaceId) {
        // check validity
        var errorMessage = "Space id validation failed, space does not exist!";
        log.error(errorMessage);
        throw new InternalDataIntegrityException(errorMessage);
    }

}
