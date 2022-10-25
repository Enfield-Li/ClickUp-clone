package com.example.apigateway;

import static com.example.clients.UrlConstants.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfiguration {

    @Autowired
    private AuthenticationFilter authenticationFilter;

    @Value("${url.authorization-service}")
    private String authorizationServiceUrl;

    @Value("${url.task-service}")
    private String taskServiceUrl;

    @Value("${url.taskEvent-service}")
    private String taskEventServiceUrl;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder
            .routes()
            .route(
                "authorization",
                route ->
                    route
                        .path(AUTHORIZATION_API_VERSION + "/**")
                        .uri(authorizationServiceUrl)
            )
            .route(
                "task",
                route ->
                    route
                        .path(TASK_API_VERSION + "/**")
                        .filters(filter -> filter.filter(authenticationFilter))
                        .uri(taskServiceUrl)
            )
            .route(
                "taskEvent",
                route ->
                    route
                        .path(TASK_EVENT_API_VERSION + "/**")
                        .filters(filter -> filter.filter(authenticationFilter))
                        .uri(taskEventServiceUrl)
            )
            .build();
    }
}
