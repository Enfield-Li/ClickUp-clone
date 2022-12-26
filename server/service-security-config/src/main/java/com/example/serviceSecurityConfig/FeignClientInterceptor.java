package com.example.serviceSecurityConfig;

import static com.example.clients.UrlConstants.AUTHORIZATION_HEADER;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import feign.RequestInterceptor;
import feign.RequestTemplate;

@Component
public class FeignClientInterceptor implements RequestInterceptor {

    @Override
    public void apply(RequestTemplate requestTemplate) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            var accessToken = (String) authentication.getCredentials();
            requestTemplate.header(AUTHORIZATION_HEADER, accessToken);
        }
    }
}
