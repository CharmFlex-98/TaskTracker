package com.tasktracker.server.tasks

import com.tasktracker.server.core.exceptions.ExceptionBase
import jakarta.servlet.http.HttpServletResponse

object TaskNotFoundException : ExceptionBase(
    HttpServletResponse.SC_NOT_FOUND,
    "TASK_NOT_FOUND",
    "Task was not found."
)

object TaskRequestInvalidException : ExceptionBase(
    HttpServletResponse.SC_BAD_REQUEST,
    "TASK_REQUEST_INVALID",
    "Task request is invalid."
)
