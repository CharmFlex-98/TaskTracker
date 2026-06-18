package com.tasktracker.server.projects

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.ResultSet
import java.sql.Timestamp

@Repository
class ProjectRepository(
    private val jdbcTemplate: NamedParameterJdbcTemplate
) {
    fun listProjects(ownerId: String): List<ProjectRecord> {
        return jdbcTemplate.query(
            """
            select id, owner_id, name, description, status, created_at, updated_at
            from projects
            where owner_id = :ownerId
            order by updated_at desc
            """.trimIndent(),
            mapOf("ownerId" to ownerId)
        ) { rs, _ -> rs.toProjectRecord() }
    }

    fun findProject(ownerId: String, projectId: String): ProjectRecord? {
        return jdbcTemplate.query(
            """
            select id, owner_id, name, description, status, created_at, updated_at
            from projects
            where owner_id = :ownerId and id = :projectId
            """.trimIndent(),
            mapOf("ownerId" to ownerId, "projectId" to projectId)
        ) { rs, _ -> rs.toProjectRecord() }.firstOrNull()
    }

    fun insertProject(record: ProjectRecord) {
        jdbcTemplate.update(
            """
            insert into projects (id, owner_id, name, description, status, created_at, updated_at)
            values (:id, :ownerId, :name, :description, :status, :createdAt, :updatedAt)
            """.trimIndent(),
            record.toParams()
        )
    }

    fun updateProject(record: ProjectRecord) {
        jdbcTemplate.update(
            """
            update projects
            set name = :name,
                description = :description,
                status = :status,
                updated_at = :updatedAt
            where owner_id = :ownerId and id = :id
            """.trimIndent(),
            record.toParams()
        )
    }

    fun deleteProject(ownerId: String, projectId: String) {
        jdbcTemplate.update(
            "delete from projects where owner_id = :ownerId and id = :projectId",
            mapOf("ownerId" to ownerId, "projectId" to projectId)
        )
    }

    private fun ProjectRecord.toParams(): Map<String, Any?> {
        return mapOf(
            "id" to id,
            "ownerId" to ownerId,
            "name" to name,
            "description" to description,
            "status" to status,
            "createdAt" to Timestamp.from(createdAt),
            "updatedAt" to Timestamp.from(updatedAt)
        )
    }

    private fun ResultSet.toProjectRecord(): ProjectRecord {
        return ProjectRecord(
            id = getString("id"),
            ownerId = getString("owner_id"),
            name = getString("name"),
            description = getString("description"),
            status = getString("status"),
            createdAt = getTimestamp("created_at").toInstant(),
            updatedAt = getTimestamp("updated_at").toInstant()
        )
    }
}
