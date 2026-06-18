package com.tasktracker.server.projects

import com.tasktracker.server.core.exceptions.ExceptionBase
import jakarta.servlet.http.HttpServletResponse

object ProjectNotFoundException : ExceptionBase(
    HttpServletResponse.SC_NOT_FOUND,
    "PROJECT_NOT_FOUND",
    "Project was not found."
)

object ProjectRequestInvalidException : ExceptionBase(
    HttpServletResponse.SC_BAD_REQUEST,
    "PROJECT_REQUEST_INVALID",
    "Project request is invalid."
)
