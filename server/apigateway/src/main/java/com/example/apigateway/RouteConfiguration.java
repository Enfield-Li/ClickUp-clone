package com.example.apigateway;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static com.example.clients.UrlConstants.*;

@Configuration
public class RouteConfiguration {

    @Autowired
    private AuthenticationFilter authenticationFilter;

    @Value("${url.team-service}")
    private String teamServiceURL;

    @Value("${url.task-service}")
    private String taskServiceURL;

//    @Value("${url.taskEvent-service}")
//    private String taskEventServiceURL;

    @Value("${url.authorization-service}")
    private String authorizationServiceURL;

    @Value("${url.teamStatusCategory-service}")
    private String teamStatusCategoryServiceURL;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("authorization", route ->
                        route.path(AUTHORIZATION_API_VERSION + "/**")
                                .uri(authorizationServiceURL))
                .route("task", route ->
                        route.path(TASK_API_VERSION + "/**")
                                .filters(filterSpec -> filterSpec.filter(authenticationFilter))
                                .uri(taskServiceURL))
                .route("team", route ->
                        route.path(TEAM_API_VERSION + "/**")
                                .filters(filterSpec -> filterSpec.filter(authenticationFilter))
                                .uri(teamServiceURL))
                .route("teamStatusCategory", route ->
                        route.path(STATUS_CATEGORY_API_VERSION + "/**")
                                .filters(filterSpec -> filterSpec.filter(authenticationFilter))
                                .uri(teamStatusCategoryServiceURL))
                .build();
    }
}
