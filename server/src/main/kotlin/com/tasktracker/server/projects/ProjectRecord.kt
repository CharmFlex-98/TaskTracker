package com.tasktracker.server.projects

import java.time.Instant

data class ProjectRecord(
    val id: String,
    val ownerId: String,
    val name: String,
    val description: String?,
    val status: String,
    val createdAt: Instant,
    val updatedAt: Instant,
)

fun ProjectRecord.toResponse(): ProjectResponse {
    return ProjectResponse(
        id = id,
        name = name,
        description = description,
        status = status,
        createdAt = createdAt.toString(),
        updatedAt = updatedAt.toString()
    )
}
