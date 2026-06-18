package com.tasktracker.server.core.exceptions

abstract class ExceptionBase(
    val statusCode: Int,
    val errorCode: String,
    val errorMessage: String
) : RuntimeException(errorMessage)
