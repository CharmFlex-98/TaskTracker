package com.tasktracker.server.auth

data class AuthenticatedUser(
    val remoteUserId: String,
    val displayName: String?,
    val email: String?,
    val avatarUrl: String?,
)
