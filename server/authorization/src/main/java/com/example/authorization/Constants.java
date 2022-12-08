package com.example.authorization;

import static com.example.clients.UrlConstants.*;

public class Constants {

    public static final String LOGIN = "/login";
    public static final String LOGOUT = "/logout";
    public static final String REGISTER = "/register";
    public static final String REFRESH_TOKEN = "/refresh_token";
    public static final String CHANGE_PASSWORD = "/change_password";

    public static final String USER_LOGIN = AUTHORIZATION_API_VERSION + LOGIN;
    public static final String USER_LOGOUT = AUTHORIZATION_API_VERSION + LOGOUT;
    public static final String USER_REGISTER = AUTHORIZATION_API_VERSION + REGISTER;
    public static final String USER_REFRESH_TOKEN = AUTHORIZATION_API_VERSION + REFRESH_TOKEN;

    public static final String SWAGGER_UI_PATH_1 = "/swagger-ui/**";
    public static final String SWAGGER_UI_PATH_2 = "/v3/api-docs/**";
}
