package com.example.panelActivity.service;

import javax.persistence.EntityManager;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.clients.jwt.UserInfo;
import com.example.clients.panelActivity.UpdateDefaultTeamInCreationDTO;
import com.example.panelActivity.model.PanelActivity;
import com.example.panelActivity.repository.PanelActivityRepository;
import com.example.panelActivity.repository.TeamActivityRepository;
import com.example.serviceExceptionHandling.InternalDataIntegrityException;
import com.example.serviceExceptionHandling.InvalidRequestException;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
@RequiredArgsConstructor
public class PanelActivityService {

    private final TeamActivityRepository teamActivityRepository;
    private final PanelActivityRepository panelActivityRepository;

    @Transactional
    public Boolean updateDefaultTeamInCreation(
            UpdateDefaultTeamInCreationDTO updatePanelActivityDTO) {
        UserInfo userInfo = new UserInfo(1, "mockUser");
        var userId = userInfo.userId();
        var teamId = updatePanelActivityDTO.teamId();
        var spaceId = updatePanelActivityDTO.spaceId();

        var panelActivityId = panelActivityRepository.findPanelActivityIdByUserId(userId);
        if (panelActivityId != null) {
            panelActivityRepository.updateDefaultTeamId(userId, teamId);
            teamActivityRepository.createNewTeamActivity(teamId, spaceId, panelActivityId);
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
                                + " 1. User's workspace activity has yet been initialized, or"
                                + " 2. User record no longer exists."));

        validatePanelActivity(panelActivity);
        return panelActivity;
    }

    private void validatePanelActivity(PanelActivity panelActivity) {
        panelActivity.getTeamActivities().stream()
                .filter(teamActivity -> teamActivity.getTeamId()
                        .equals(panelActivity.getDefaultTeamId()))
                .findAny()
                .orElseThrow(() -> {
                    log.error("InternalDataIntegrityException, This really shouldn't have happened...");
                    throw new InternalDataIntegrityException(
                            "PanelActivity data integrity breached...");
                });
    }

    private void validateSpaceId(Integer spaceId) {
        // check validity
        var errorMessage = "Space id validation failed, space does not exist!";
        log.error(errorMessage);
        throw new InternalDataIntegrityException(errorMessage);
    }
}
