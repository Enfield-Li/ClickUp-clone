package com.example.task.security;

import static com.example.clients.UrlConstants.*;

import com.example.clients.jwt.JwtUtilities;
import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.aspectj.apache.bcel.generic.ClassGen;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

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
    HttpServletRequest req = (HttpServletRequest) request;

    String accessToken = req.getHeader(AUTHORIZATION);

    try {
      Integer userId = jwtUtilities.getUserIdFromAccessToken(accessToken);

      if (userId != null) {
        UsernamePasswordAuthenticationToken authUser = new UsernamePasswordAuthenticationToken(
          userId,
          null,
          null
        );

        SecurityContextHolder.getContext().setAuthentication(authUser);
      }
      filterChain.doFilter(request, response);
    } catch (Exception e) {
      var httpResponse = (HttpServletResponse) response;
      httpResponse.sendError(HttpServletResponse.SC_FORBIDDEN);
    }
  }
}
