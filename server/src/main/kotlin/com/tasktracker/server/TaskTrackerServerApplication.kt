package com.tasktracker.server

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TaskTrackerServerApplication

fun main(args: Array<String>) {
    runApplication<TaskTrackerServerApplication>(*args)
}
