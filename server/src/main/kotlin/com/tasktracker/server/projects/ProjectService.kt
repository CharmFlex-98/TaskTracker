package com.tasktracker.server.projects

import com.tasktracker.server.auth.AuthenticatedUser
import com.tasktracker.server.users.UserRepository
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.UUID

@Service
class ProjectService(
    private val projectRepository: ProjectRepository,
    private val userRepository: UserRepository,
) {
    fun listProjects(user: AuthenticatedUser): List<ProjectResponse> {
        userRepository.upsertUser(user)
        return projectRepository.listProjects(user.remoteUserId).map { it.toResponse() }
    }

    fun getProject(user: AuthenticatedUser, projectId: String): ProjectResponse {
        userRepository.upsertUser(user)
        return findOwnedProject(user.remoteUserId, projectId).toResponse()
    }

    fun createProject(user: AuthenticatedUser, request: CreateProjectRequest): ProjectResponse {
        userRepository.upsertUser(user)
        val name = request.name.trim()
        if (name.isBlank()) throw ProjectRequestInvalidException
        val now = Instant.now()
        val project = ProjectRecord(
            id = UUID.randomUUID().toString(),
            ownerId = user.remoteUserId,
            name = name,
            description = request.description?.trim()?.takeIf { it.isNotBlank() },
            status = ACTIVE_STATUS,
            createdAt = now,
            updatedAt = now
        )
        projectRepository.insertProject(project)
        return project.toResponse()
    }

    fun updateProject(user: AuthenticatedUser, projectId: String, request: UpdateProjectRequest): ProjectResponse {
        userRepository.upsertUser(user)
        val existingProject = findOwnedProject(user.remoteUserId, projectId)
        val name = request.name.trim()
        val status = request.status.trim().lowercase()
        if (name.isBlank() || status !in PROJECT_STATUSES) throw ProjectRequestInvalidException
        val updatedProject = existingProject.copy(
            name = name,
            description = request.description?.trim()?.takeIf { it.isNotBlank() },
            status = status,
            updatedAt = Instant.now()
        )
        projectRepository.updateProject(updatedProject)
        return updatedProject.toResponse()
    }

    fun deleteProject(user: AuthenticatedUser, projectId: String) {
        userRepository.upsertUser(user)
        findOwnedProject(user.remoteUserId, projectId)
        projectRepository.deleteProject(user.remoteUserId, projectId)
    }

    private fun findOwnedProject(ownerId: String, projectId: String): ProjectRecord {
        return projectRepository.findProject(ownerId, projectId) ?: throw ProjectNotFoundException
    }

    companion object {
        private const val ACTIVE_STATUS = "active"
        private val PROJECT_STATUSES = setOf("active", "archived")
    }
}
