package com.tasktracker.server.tasks

import com.tasktracker.server.auth.AuthenticatedUser
import com.tasktracker.server.projects.ProjectNotFoundException
import com.tasktracker.server.projects.ProjectRepository
import com.tasktracker.server.users.UserRepository
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.time.format.DateTimeParseException
import java.util.UUID

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    private val projectRepository: ProjectRepository,
    private val userRepository: UserRepository,
) {
    fun listTasks(
        user: AuthenticatedUser,
        projectId: String?,
        status: String?,
        priority: String?,
        searchQuery: String?,
    ): List<TaskResponse> {
        userRepository.upsertUser(user)
        val normalizedProjectId = projectId?.trim()?.takeIf { it.isNotBlank() }
        if (normalizedProjectId != null) {
            requireOwnedProject(user.remoteUserId, normalizedProjectId)
        }
        val normalizedStatus = status?.trim()?.lowercase()?.takeIf { it.isNotBlank() }
        val normalizedPriority = priority?.trim()?.lowercase()?.takeIf { it.isNotBlank() }
        val normalizedSearchQuery = searchQuery?.trim()?.lowercase()?.takeIf { it.isNotBlank() }
        if (
            normalizedStatus != null && normalizedStatus !in TASK_STATUSES ||
            normalizedPriority != null && normalizedPriority !in TASK_PRIORITIES
        ) {
            throw TaskRequestInvalidException
        }
        return taskRepository
            .listTasks(user.remoteUserId, normalizedProjectId, normalizedStatus, normalizedPriority, normalizedSearchQuery)
            .map { it.toResponse() }
    }

    fun getTask(user: AuthenticatedUser, taskId: String): TaskResponse {
        userRepository.upsertUser(user)
        return findOwnedTask(user.remoteUserId, taskId).toResponse()
    }

    fun createTask(user: AuthenticatedUser, request: CreateTaskRequest): TaskResponse {
        userRepository.upsertUser(user)
        val projectId = request.projectId.trim()
        requireOwnedProject(user.remoteUserId, projectId)
        val title = request.title.trim()
        val status = request.status?.trim()?.lowercase()?.takeIf { it.isNotBlank() } ?: TODO_STATUS
        val priority = request.priority?.trim()?.lowercase()?.takeIf { it.isNotBlank() } ?: MEDIUM_PRIORITY
        val progress = request.progress ?: 0
        if (title.isBlank() || status !in TASK_STATUSES || priority !in TASK_PRIORITIES || progress !in 0..100) {
            throw TaskRequestInvalidException
        }
        val now = Instant.now()
        val task = TaskRecord(
            id = UUID.randomUUID().toString(),
            ownerId = user.remoteUserId,
            projectId = projectId,
            title = title,
            description = request.description?.trim()?.takeIf { it.isNotBlank() },
            status = status,
            priority = priority,
            dueDate = parseDueDate(request.dueDate),
            progress = progress,
            createdAt = now,
            updatedAt = now
        )
        taskRepository.insertTask(task)
        return task.toResponse()
    }

    fun updateTask(user: AuthenticatedUser, taskId: String, request: UpdateTaskRequest): TaskResponse {
        userRepository.upsertUser(user)
        val existingTask = findOwnedTask(user.remoteUserId, taskId)
        val projectId = request.projectId.trim()
        requireOwnedProject(user.remoteUserId, projectId)
        val title = request.title.trim()
        val status = request.status.trim().lowercase()
        val priority = request.priority.trim().lowercase()
        if (title.isBlank() || status !in TASK_STATUSES || priority !in TASK_PRIORITIES || request.progress !in 0..100) {
            throw TaskRequestInvalidException
        }
        val updatedTask = existingTask.copy(
            projectId = projectId,
            title = title,
            description = request.description?.trim()?.takeIf { it.isNotBlank() },
            status = status,
            priority = priority,
            dueDate = parseDueDate(request.dueDate),
            progress = request.progress,
            updatedAt = Instant.now()
        )
        taskRepository.updateTask(updatedTask)
        return updatedTask.toResponse()
    }

    fun deleteTask(user: AuthenticatedUser, taskId: String) {
        userRepository.upsertUser(user)
        findOwnedTask(user.remoteUserId, taskId)
        taskRepository.deleteTask(user.remoteUserId, taskId)
    }

    private fun findOwnedTask(ownerId: String, taskId: String): TaskRecord {
        return taskRepository.findTask(ownerId, taskId) ?: throw TaskNotFoundException
    }

    private fun requireOwnedProject(ownerId: String, projectId: String) {
        if (projectId.isBlank()) throw ProjectNotFoundException
        projectRepository.findProject(ownerId, projectId) ?: throw ProjectNotFoundException
    }

    private fun parseDueDate(value: String?): LocalDate? {
        val normalized = value?.trim()?.takeIf { it.isNotBlank() } ?: return null
        return try {
            LocalDate.parse(normalized)
        } catch (exception: DateTimeParseException) {
            throw TaskRequestInvalidException
        }
    }

    companion object {
        private const val TODO_STATUS = "todo"
        private const val MEDIUM_PRIORITY = "medium"
        private val TASK_STATUSES = setOf("todo", "in_progress", "blocked", "done")
        private val TASK_PRIORITIES = setOf("low", "medium", "high", "urgent")
    }
}
