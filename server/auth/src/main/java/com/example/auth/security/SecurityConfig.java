package com.example.auth.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

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
      .permitAll();

    // Disable anonymousUser
    http.authorizeRequests().anyRequest().authenticated();
  }
}
