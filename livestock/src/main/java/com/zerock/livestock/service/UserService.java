package com.zerock.livestock.service;

import com.zerock.livestock.entity.User;

public interface UserService {
    User registerUser(String username, String password, String email);
    User authenticate(String username, String password);
}