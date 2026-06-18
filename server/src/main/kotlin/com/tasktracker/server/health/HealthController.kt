package com.tasktracker.server.health

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant

@RestController
@RequestMapping("/api")
class HealthController {
    @GetMapping("/health")
    fun health(): HealthResponse {
        return HealthResponse(
            status = "ok",
            service = "TaskTracker Server",
            timestamp = Instant.now()
        )
    }
}

data class HealthResponse(
    val status: String,
    val service: String,
    val timestamp: Instant
)
