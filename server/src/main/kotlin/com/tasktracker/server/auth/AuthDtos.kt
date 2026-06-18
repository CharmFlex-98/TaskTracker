package com.tasktracker.server.auth

import jakarta.validation.constraints.NotBlank

data class FirebaseAuthRequest(
    @field:NotBlank val idToken: String
)

data class AuthUserResponse(
    val id: String,
    val email: String,
    val name: String,
    val avatarUrl: String?
)

data class AuthSessionResponse(
    val accessToken: String,
    val refreshToken: String,
    val expiresAt: String,
    val user: AuthUserResponse
)
