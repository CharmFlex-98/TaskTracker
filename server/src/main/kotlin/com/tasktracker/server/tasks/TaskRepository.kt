package com.tasktracker.server.tasks

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.Date
import java.sql.ResultSet
import java.sql.Timestamp

@Repository
class TaskRepository(
    private val jdbcTemplate: NamedParameterJdbcTemplate
) {
    fun listTasks(ownerId: String, projectId: String?, status: String?, priority: String?, searchQuery: String?): List<TaskRecord> {
        val projectFilter = if (projectId == null) "" else "and project_id = :projectId"
        val statusFilter = if (status == null) "" else "and status = :status"
        val priorityFilter = if (priority == null) "" else "and priority = :priority"
        val searchFilter = if (searchQuery == null) {
            ""
        } else {
            "and (lower(title) like :searchQuery or lower(coalesce(description, '')) like :searchQuery)"
        }
        return jdbcTemplate.query(
            """
            select id, owner_id, project_id, title, description, status, priority, due_date, progress, created_at, updated_at
            from tasks
            where owner_id = :ownerId
            $projectFilter
            $statusFilter
            $priorityFilter
            $searchFilter
            order by updated_at desc
            """.trimIndent(),
            mapOf(
                "ownerId" to ownerId,
                "projectId" to projectId,
                "status" to status,
                "priority" to priority,
                "searchQuery" to searchQuery?.let { "%${it.lowercase()}%" }
            )
        ) { rs, _ -> rs.toTaskRecord() }
    }

    fun findTask(ownerId: String, taskId: String): TaskRecord? {
        return jdbcTemplate.query(
            """
            select id, owner_id, project_id, title, description, status, priority, due_date, progress, created_at, updated_at
            from tasks
            where owner_id = :ownerId and id = :taskId
            """.trimIndent(),
            mapOf("ownerId" to ownerId, "taskId" to taskId)
        ) { rs, _ -> rs.toTaskRecord() }.firstOrNull()
    }

    fun insertTask(record: TaskRecord) {
        jdbcTemplate.update(
            """
            insert into tasks (
                id, owner_id, project_id, title, description, status, priority, due_date, progress, created_at, updated_at
            )
            values (
                :id, :ownerId, :projectId, :title, :description, :status, :priority, :dueDate, :progress, :createdAt, :updatedAt
            )
            """.trimIndent(),
            record.toParams()
        )
    }

    fun updateTask(record: TaskRecord) {
        jdbcTemplate.update(
            """
            update tasks
            set project_id = :projectId,
                title = :title,
                description = :description,
                status = :status,
                priority = :priority,
                due_date = :dueDate,
                progress = :progress,
                updated_at = :updatedAt
            where owner_id = :ownerId and id = :id
            """.trimIndent(),
            record.toParams()
        )
    }

    fun deleteTask(ownerId: String, taskId: String) {
        jdbcTemplate.update(
            "delete from tasks where owner_id = :ownerId and id = :taskId",
            mapOf("ownerId" to ownerId, "taskId" to taskId)
        )
    }

    private fun TaskRecord.toParams(): Map<String, Any?> {
        return mapOf(
            "id" to id,
            "ownerId" to ownerId,
            "projectId" to projectId,
            "title" to title,
            "description" to description,
            "status" to status,
            "priority" to priority,
            "dueDate" to dueDate?.let { Date.valueOf(it) },
            "progress" to progress,
            "createdAt" to Timestamp.from(createdAt),
            "updatedAt" to Timestamp.from(updatedAt)
        )
    }

    private fun ResultSet.toTaskRecord(): TaskRecord {
        return TaskRecord(
            id = getString("id"),
            ownerId = getString("owner_id"),
            projectId = getString("project_id"),
            title = getString("title"),
            description = getString("description"),
            status = getString("status"),
            priority = getString("priority"),
            dueDate = getDate("due_date")?.toLocalDate(),
            progress = getInt("progress"),
            createdAt = getTimestamp("created_at").toInstant(),
            updatedAt = getTimestamp("updated_at").toInstant()
        )
    }
}
