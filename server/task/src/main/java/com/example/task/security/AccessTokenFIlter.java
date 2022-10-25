package com.example.task.security;

import static com.example.clients.UrlConstants.AUTHORIZATION;

import com.example.clients.jwt.InvalidTokenException;
import com.example.clients.jwt.JwtUtilities;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

@Log4j2
public class AccessTokenFilter extends GenericFilterBean {

    JwtUtilities jwtUtilities;

    public AccessTokenFilter(JwtUtilities jwtUtilities) {
        this.jwtUtilities = jwtUtilities;
    }

    @Override
    public void doFilter(
        ServletRequest request,
        ServletResponse response,
        FilterChain filterChain
    )
        throws IOException, ServletException {
        var req = (HttpServletRequest) request;

        var accessToken = req.getHeader(AUTHORIZATION);

        try {
            var userInfo = jwtUtilities.getUserInfoFromAccessToken(accessToken);

            if (userInfo != null) {
                var authUser = new UsernamePasswordAuthenticationToken(
                    userInfo,
                    null,
                    null
                );

                SecurityContextHolder.getContext().setAuthentication(authUser);
            }
            
            filterChain.doFilter(request, response);
        } catch (InvalidTokenException e) {
            log.warn("User not authorized" + e);
            var httpResponse = (HttpServletResponse) response;
            httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN);
        }
    }
}
