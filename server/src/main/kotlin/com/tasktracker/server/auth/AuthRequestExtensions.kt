package com.tasktracker.server.auth

import jakarta.servlet.http.HttpServletRequest

fun HttpServletRequest.authenticatedUser(): AuthenticatedUser {
    return getAttribute(FirebaseAuthFilter.AUTHENTICATED_USER_ATTRIBUTE) as? AuthenticatedUser
        ?: throw MissingAuthorizationException
}
