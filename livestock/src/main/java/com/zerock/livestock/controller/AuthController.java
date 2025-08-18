package com.zerock.livestock.controller;

import com.zerock.livestock.config.JwtUtil;
import com.zerock.livestock.dto.LoginRequest;
import com.zerock.livestock.dto.RegisterRequest;
import com.zerock.livestock.entity.User;
import com.zerock.livestock.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticate(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );

            String token = jwtUtil.generateToken(user.getUsername());

            return ResponseEntity.ok(Map.of("token", token));
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "로그인 실패: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User registeredUser = userService.registerUser(
                    request.getUsername(),
                    request.getPassword(),
                    request.getEmail()
            );
            return ResponseEntity.ok(Map.of("message", "회원가입 성공", "userId", registeredUser.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
