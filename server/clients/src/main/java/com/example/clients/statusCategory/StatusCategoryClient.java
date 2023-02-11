package com.example.clients.statusCategory;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import static com.example.clients.UrlConstants.STATUS_CATEGORY_API_VERSION;

@FeignClient(name = "statusCategory", url = "${clients.statusCategory.url}")
public interface StatusCategoryClient {

    @PostMapping(path = STATUS_CATEGORY_API_VERSION + "/{teamId}")
    Integer initStatusCategoryForTeam(
            @PathVariable("teamId") Integer teamId);

    @PostMapping(path = STATUS_CATEGORY_API_VERSION
            + "/init_status_category/{teamId}")
    StatusCategoryDTO initDefaultStatusCategoryInRegistration(
            @PathVariable("teamId") Integer teamId);

    @GetMapping(path = STATUS_CATEGORY_API_VERSION)
    StatusCategoryDTO getStatusCategoryForList(
            @RequestParam("id") Integer id);

}
