package com.example.clients.panelActivity;

import static com.example.clients.UrlConstants.PANEL_ACTIVITY_API_VERSION;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "fraud", url = "${clients.panelActivity.url}")
public interface PanelActivityClient {

    @GetMapping(path = PANEL_ACTIVITY_API_VERSION + "/{userId}")
    PanelActivityDTO getPanelActivity(
            @PathVariable("userId") Integer userId);

    @PostMapping(path = PANEL_ACTIVITY_API_VERSION)
    Boolean updateDefaultTeam(
            @RequestBody UpdateDefaultTeamDTO createPanelActivityDTO);

}
