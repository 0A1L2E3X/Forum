package com.example.mapper;

import com.example.entity.User;

import java.util.List;

public interface UserMapper {

    void insert(User user);

    User selectByUsername(String username);

    void deleteByID(Integer id);

    void updateByID(User user);

    User selectByID(Integer id);

    List<User> selectAll(User user);
}
