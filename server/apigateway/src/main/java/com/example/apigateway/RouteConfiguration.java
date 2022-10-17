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

    @Value("${url.customer-service}")
    private String customerServiceUrl;

    @Value("${url.task-service}")
    private String taskServiceUrl;

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
                "customer",
                route ->
                    route
                        .path(CUSTOMER_API_VERSION + "/**")
                        .filters(filter -> filter.filter(authenticationFilter))
                        .uri(customerServiceUrl)
            )
            .route(
                "task",
                route ->
                    route
                        .path(TASK_API_VERSION + "/**")
                        .filters(filter -> filter.filter(authenticationFilter))
                        .uri(taskServiceUrl)
            )
            .build();
    }
}
