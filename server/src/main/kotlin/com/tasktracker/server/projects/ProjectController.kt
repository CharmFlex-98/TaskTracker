package com.tasktracker.server.projects

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
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/projects")
class ProjectController(
    private val projectService: ProjectService
) {
    @GetMapping
    fun listProjects(servletRequest: HttpServletRequest): List<ProjectResponse> {
        return projectService.listProjects(servletRequest.authenticatedUser())
    }

    @GetMapping("/{projectId}")
    fun getProject(
        servletRequest: HttpServletRequest,
        @PathVariable projectId: String
    ): ProjectResponse {
        return projectService.getProject(servletRequest.authenticatedUser(), projectId)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createProject(
        servletRequest: HttpServletRequest,
        @Valid @RequestBody request: CreateProjectRequest
    ): ProjectResponse {
        return projectService.createProject(servletRequest.authenticatedUser(), request)
    }

    @PutMapping("/{projectId}")
    fun updateProject(
        servletRequest: HttpServletRequest,
        @PathVariable projectId: String,
        @Valid @RequestBody request: UpdateProjectRequest
    ): ProjectResponse {
        return projectService.updateProject(servletRequest.authenticatedUser(), projectId, request)
    }

    @DeleteMapping("/{projectId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteProject(
        servletRequest: HttpServletRequest,
        @PathVariable projectId: String
    ) {
        projectService.deleteProject(servletRequest.authenticatedUser(), projectId)
    }
}
