package com.example.clients.statusCategory;

import static com.example.clients.UrlConstants.STATUS_CATEGORY_API_VERSION;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "statusCategory", url = "${clients.statusCategory.url}")
public interface StatusCategoryClient {

    @PostMapping(path = STATUS_CATEGORY_API_VERSION + "/{teamId}")
    Integer initStatusCategoryForTeam(
            @PathVariable("teamId") Integer teamId);
}
