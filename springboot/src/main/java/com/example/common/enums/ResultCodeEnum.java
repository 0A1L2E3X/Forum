package com.example.common.enums;

public enum ResultCodeEnum {
    SUCCESS("200", "[MESSAGE] Success"),

    PARAM_ERROR("400", "[MESSAGE] Parameter Error"),
    TOKEN_INVALID_ERROR("401", "[MESSAGE] Invalid Token"),
    TOKEN_CHECK_ERROR("401", "[MESSAGE] Token Check Error, Please login again"),
    PARAM_LOST_ERROR("4001", "[MESSAGE] Parameter lost"),

    SYSTEM_ERROR("500", "[MESSAGE] System Error"),
    USER_EXIST_ERROR("5001", "[MESSAGE] User already exist"),
    USER_NOT_LOGIN("5002", "[MESSAGE] User not login"),
    USER_ACCOUNT_ERROR("5003", "[MESSAGE] Wrong Username or Password"),
    USER_NOT_EXIST_ERROR("5004", "[MESSAGE] User not exist"),
    PARAM_PASSWORD_ERROR("5005", "[MESSAGE] Original Password Error"),
    ;

    public String code;
    public String msg;

    ResultCodeEnum(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
