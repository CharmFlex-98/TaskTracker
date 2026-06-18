package com.tasktracker.server.tasks

import java.time.Instant
import java.time.LocalDate

data class TaskRecord(
    val id: String,
    val ownerId: String,
    val projectId: String,
    val title: String,
    val description: String?,
    val status: String,
    val priority: String,
    val dueDate: LocalDate?,
    val progress: Int,
    val createdAt: Instant,
    val updatedAt: Instant,
)

fun TaskRecord.toResponse(): TaskResponse {
    return TaskResponse(
        id = id,
        projectId = projectId,
        title = title,
        description = description,
        status = status,
        priority = priority,
        dueDate = dueDate?.toString(),
        progress = progress,
        createdAt = createdAt.toString(),
        updatedAt = updatedAt.toString()
    )
}
