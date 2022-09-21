package com.example.apigateway;

import static com.example.clients.UrlConstants.*;

import com.example.clients.jwt.JwtUtilities;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

// https://stackoverflow.com/a/66063473/16648127
@Log4j2
@Configuration
public class AuthenticationFilter implements GatewayFilter {

  @Autowired
  JwtUtilities jwtUtils;

  @Override
  public Mono<Void> filter(
    ServerWebExchange exchange,
    GatewayFilterChain chain
  ) {
    ServerHttpRequest request = exchange.getRequest();

    var authHeader = request.getHeaders().get(AUTHORIZATION);

    // An auth request must have "Authorization" header to carry access token
    if (authHeader == null) {
      return onAuthenticationError(exchange, HttpStatus.FORBIDDEN);
    }

    try {
      jwtUtils.validateAccessToken(authHeader.get(0));
    } catch (Exception e) {
      log.error(e);
      return onAuthenticationError(exchange, HttpStatus.FORBIDDEN);
    }

    return chain.filter(exchange);
  }

  private Mono<Void> onAuthenticationError(
    ServerWebExchange exchange,
    HttpStatus httpStatus
  ) {
    ServerHttpResponse response = exchange.getResponse();
    response.setStatusCode(httpStatus);
    return response.setComplete();
  }
}
