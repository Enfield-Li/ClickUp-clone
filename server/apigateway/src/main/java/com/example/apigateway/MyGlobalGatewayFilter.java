package com.example.apigateway;

import lombok.extern.log4j.Log4j2;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

// execution order:
// default filter(order starting at 1)
//      -> route filter(order starting at 1)
//          -> global filter(customized)

@Log4j2
@Order(-1)
@Component
public class MyGlobalGatewayFilter implements GlobalFilter {

  public Mono<Void> filter(
    ServerWebExchange exchange,
    GatewayFilterChain chain
  ) {
    // ServerHttpRequest request = exchange.getRequest();
    // MultiValueMap<String, String> params = request.getQueryParams();

    // String auth = params.getFirst("authorization");

    // if ("admin".equals(auth)) {
    //   return chain.filter(exchange);
    // }

    // exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
    // return exchange.getResponse().setComplete();

    log.info("********* gateway runs ********");
    return chain.filter(exchange);
  }
}
