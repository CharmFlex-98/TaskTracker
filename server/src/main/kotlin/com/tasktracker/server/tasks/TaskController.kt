package com.tasktracker.server.tasks

import com.tasktracker.server.auth.authenticatedUser
import jakarta.servlet.http.HttpServletRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/tasks")
class TaskController(
    private val taskService: TaskService
) {
    @GetMapping
    fun listTasks(
        servletRequest: HttpServletRequest,
        @RequestParam(required = false) projectId: String?,
        @RequestParam(required = false) status: String?,
        @RequestParam(required = false) priority: String?,
        @RequestParam(required = false, name = "q") searchQuery: String?,
    ): List<TaskResponse> {
        return taskService.listTasks(servletRequest.authenticatedUser(), projectId, status, priority, searchQuery)
    }

    @GetMapping("/{taskId}")
    fun getTask(
        servletRequest: HttpServletRequest,
        @PathVariable taskId: String
    ): TaskResponse {
        return taskService.getTask(servletRequest.authenticatedUser(), taskId)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createTask(
        servletRequest: HttpServletRequest,
        @Valid @RequestBody request: CreateTaskRequest
    ): TaskResponse {
        return taskService.createTask(servletRequest.authenticatedUser(), request)
    }

    @PutMapping("/{taskId}")
    fun updateTask(
        servletRequest: HttpServletRequest,
        @PathVariable taskId: String,
        @Valid @RequestBody request: UpdateTaskRequest
    ): TaskResponse {
        return taskService.updateTask(servletRequest.authenticatedUser(), taskId, request)
    }

    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteTask(
        servletRequest: HttpServletRequest,
        @PathVariable taskId: String
    ) {
        taskService.deleteTask(servletRequest.authenticatedUser(), taskId)
    }
}
