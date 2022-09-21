package com.example.auth;

import static com.example.clients.UrlConstants.*;

public class Constants {

  public static final String LOGIN = "/login";
  public static final String LOGOUT = "/logout";
  public static final String REGISTER = "/register";
  public static final String REFRESH_TOKEN = "/refresh_token";

  public static final String USER_LOGIN = USER_API + LOGIN;
  public static final String USER_LOGOUT = USER_API + LOGOUT;
  public static final String USER_REGISTER = USER_API + REGISTER;
  public static final String USER_REFRESH_TOKEN = USER_API + REFRESH_TOKEN;

  public static final String SWAGGER_UI_PATH_1 = "/swagger-ui/**";
  public static final String SWAGGER_UI_PATH_2 = "/v3/api-docs/**";
}
