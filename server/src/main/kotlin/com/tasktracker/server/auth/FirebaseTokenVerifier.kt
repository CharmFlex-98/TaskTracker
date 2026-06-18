package com.tasktracker.server.auth

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.auth.FirebaseAuth
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.io.ByteArrayInputStream
import java.io.FileInputStream

@Service
class FirebaseTokenVerifier(
    @Value("\${firebase.service-account-json:}") private val serviceAccountJson: String,
    @Value("\${firebase.service-account-path:}") private val serviceAccountPath: String,
    @Value("\${firebase.project-id:}") private val projectId: String,
) {
    private val firebaseAuth: FirebaseAuth? by lazy { initFirebaseAuth() }

    fun verify(idToken: String): AuthenticatedUser {
        val auth = firebaseAuth ?: throw FirebaseAuthNotConfiguredException
        val token = runCatching { auth.verifyIdToken(idToken) }.getOrElse {
            throw InvalidAuthorizationException
        }
        val uid = token.uid.trim()
        if (uid.isBlank()) throw InvalidAuthorizationException

        return AuthenticatedUser(
            remoteUserId = uid,
            displayName = token.name?.trim()?.takeIf { it.isNotBlank() },
            email = token.email?.trim()?.takeIf { it.isNotBlank() },
            avatarUrl = token.picture?.trim()?.takeIf { it.isNotBlank() }
        )
    }

    private fun initFirebaseAuth(): FirebaseAuth? {
        val credentials = runCatching {
            when {
                serviceAccountJson.isNotBlank() -> GoogleCredentials.fromStream(
                    ByteArrayInputStream(serviceAccountJson.toByteArray())
                )
                serviceAccountPath.isNotBlank() -> GoogleCredentials.fromStream(FileInputStream(serviceAccountPath))
                else -> GoogleCredentials.getApplicationDefault()
            }
        }.getOrNull() ?: return null

        return runCatching {
            val optionsBuilder = FirebaseOptions.builder().setCredentials(credentials)
            if (projectId.isNotBlank()) {
                optionsBuilder.setProjectId(projectId)
            }
            val app = FirebaseApp.getApps().firstOrNull()
                ?: FirebaseApp.initializeApp(optionsBuilder.build())
            FirebaseAuth.getInstance(app)
        }.getOrNull()
    }
}
