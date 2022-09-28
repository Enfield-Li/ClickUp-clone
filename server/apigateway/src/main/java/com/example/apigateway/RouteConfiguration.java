package com.example.apigateway;

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

  @Bean
  public RouteLocator routes(RouteLocatorBuilder builder) {
    return builder
      .routes()
      .route(
        "authorization",
        route ->
          route.path("/authorization/v1/user/**").uri(authorizationServiceUrl)
      )
      .route(
        "customer",
        route ->
          route
            .path("/api/v1/customers/**")
            .filters(filter -> filter.filter(authenticationFilter))
            .uri(customerServiceUrl)
      )
      .build();
  }
}
