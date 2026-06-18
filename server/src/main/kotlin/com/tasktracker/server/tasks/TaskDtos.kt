package com.tasktracker.server.tasks

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

data class TaskResponse(
    val id: String,
    val projectId: String,
    val title: String,
    val description: String?,
    val status: String,
    val priority: String,
    val dueDate: String?,
    val progress: Int,
    val createdAt: String,
    val updatedAt: String,
)

data class CreateTaskRequest(
    @field:NotBlank val projectId: String,
    @field:NotBlank val title: String,
    val description: String?,
    val status: String?,
    val priority: String?,
    val dueDate: String?,
    @field:Min(0) @field:Max(100) val progress: Int?,
)

data class UpdateTaskRequest(
    @field:NotBlank val projectId: String,
    @field:NotBlank val title: String,
    val description: String?,
    @field:NotBlank val status: String,
    @field:NotBlank val priority: String,
    val dueDate: String?,
    @field:Min(0) @field:Max(100) val progress: Int,
)
