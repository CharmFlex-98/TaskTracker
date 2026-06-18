package com.tasktracker.server.core.exceptions

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.http.converter.HttpMessageNotReadableException

@ControllerAdvice
internal class GlobalExceptionHandler {
    @ExceptionHandler(ExceptionBase::class)
    fun handleException(exceptionBase: ExceptionBase): ResponseEntity<Map<String, Any>> {
        val body = mapOf(
            "errorCode" to exceptionBase.errorCode,
            "errorMessage" to exceptionBase.errorMessage
        )
        return ResponseEntity
            .status(exceptionBase.statusCode)
            .body(body)
    }

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(exception: MethodArgumentNotValidException): ResponseEntity<Map<String, Any>> {
        val fieldErrors = exception.bindingResult.fieldErrors.associate { fieldError ->
            fieldError.field to (fieldError.defaultMessage ?: "invalid")
        }
        return ResponseEntity
            .badRequest()
            .body(
                mapOf(
                    "errorCode" to "VALIDATION_ERROR",
                    "errorMessage" to "Request validation failed",
                    "fieldErrors" to fieldErrors
                )
            )
    }

    @ExceptionHandler(HttpMessageNotReadableException::class)
    fun handleUnreadableMessage(exception: HttpMessageNotReadableException): ResponseEntity<Map<String, Any>> {
        return ResponseEntity
            .badRequest()
            .body(
                mapOf(
                    "errorCode" to "INVALID_REQUEST_BODY",
                    "errorMessage" to "Request body is missing required fields or is not valid JSON"
                )
            )
    }
}
