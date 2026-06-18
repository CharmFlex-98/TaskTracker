package com.tasktracker.server.projects

import jakarta.validation.constraints.NotBlank

data class ProjectResponse(
    val id: String,
    val name: String,
    val description: String?,
    val status: String,
    val createdAt: String,
    val updatedAt: String,
)

data class CreateProjectRequest(
    @field:NotBlank val name: String,
    val description: String?,
)

data class UpdateProjectRequest(
    @field:NotBlank val name: String,
    val description: String?,
    @field:NotBlank val status: String,
)
