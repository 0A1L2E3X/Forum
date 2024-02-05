package com.example.common.enums;

public enum LikesModuleEnum {

    BLOG("Blog"),
    ACTIVITY("Activity");

    private String value;

    public String getValue() {
        return value;
    }

    LikesModuleEnum(String value) {
        this.value = value;
    }
}
