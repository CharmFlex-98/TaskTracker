package com.tasktracker.server.users

import com.tasktracker.server.auth.AuthenticatedUser
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class UserRepository(
    private val jdbcTemplate: NamedParameterJdbcTemplate
) {
    fun upsertUser(user: AuthenticatedUser) {
        jdbcTemplate.update(
            """
            insert into tasktracker_users (id, email, display_name, avatar_url, created_at, updated_at)
            values (:id, :email, :displayName, :avatarUrl, current_timestamp, current_timestamp)
            on conflict (id) do update set
                email = excluded.email,
                display_name = excluded.display_name,
                avatar_url = excluded.avatar_url,
                updated_at = current_timestamp
            """.trimIndent(),
            mapOf(
                "id" to user.remoteUserId,
                "email" to user.email,
                "displayName" to user.displayName,
                "avatarUrl" to user.avatarUrl
            )
        )
    }
}
