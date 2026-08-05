package com.dto.response;

public record TokenResponse(String token, long expiresIn) {
}
