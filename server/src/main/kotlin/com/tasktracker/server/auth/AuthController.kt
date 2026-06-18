package com.tasktracker.server.auth

import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/auth")
class AuthController(
    private val firebaseTokenVerifier: FirebaseTokenVerifier
) {
    @PostMapping("/firebase")
    fun signInWithFirebase(@Valid @RequestBody request: FirebaseAuthRequest): AuthSessionResponse {
        val user = firebaseTokenVerifier.verify(request.idToken)
        return AuthSessionResponse(
            accessToken = request.idToken,
            refreshToken = "",
            expiresAt = "",
            user = AuthUserResponse(
                id = user.remoteUserId,
                email = user.email ?: "",
                name = user.displayName ?: "",
                avatarUrl = user.avatarUrl
            )
        )
    }
}
