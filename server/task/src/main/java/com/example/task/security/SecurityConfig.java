package com.example.task.security;

import com.example.clients.jwt.JwtUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Autowired
  JwtUtilities jwtUtilities;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .cors()
      .and()
      .csrf()
      .disable()
      .formLogin()
      .disable()
      .logout()
      .disable()
      .authorizeRequests()
      .antMatchers("/**")
      .permitAll()
      // .and()
      // .sessionManagement()
      // .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      // .and()
      // .addFilterBefore( // Verify JWT on every request
      //   new AccessTokenFilter(jwtUtilities),
      //   UsernamePasswordAuthenticationFilter.class
      // )
      ;

    // Disable anonymousUser
    http.authorizeRequests().anyRequest().authenticated();
  }
}
