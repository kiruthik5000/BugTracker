package com.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

@Configuration
public class DatabaseSchemaFixConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSchemaFixConfig.class);

    /**
     * Drops any legacy UNIQUE index on projects.managed_by left over from an earlier
     * @OneToOne mapping so a project manager can manage multiple projects.
     */
    @Bean
    public ApplicationRunner dropLegacyProjectManagerUniqueIndex(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                List<String> uniqueIndexes = jdbcTemplate.queryForList(
                        """
                        SELECT DISTINCT INDEX_NAME
                        FROM information_schema.STATISTICS
                        WHERE TABLE_SCHEMA = DATABASE()
                          AND TABLE_NAME = 'projects'
                          AND COLUMN_NAME = 'managed_by'
                          AND NON_UNIQUE = 0
                          AND INDEX_NAME <> 'PRIMARY'
                        """,
                        String.class
                );

                if (!uniqueIndexes.isEmpty()) {
                    Integer nonUniqueCount = jdbcTemplate.queryForObject(
                            """
                            SELECT COUNT(*)
                            FROM information_schema.STATISTICS
                            WHERE TABLE_SCHEMA = DATABASE()
                              AND TABLE_NAME = 'projects'
                              AND COLUMN_NAME = 'managed_by'
                              AND NON_UNIQUE = 1
                            """,
                            Integer.class
                    );

                    if (nonUniqueCount == null || nonUniqueCount == 0) {
                        jdbcTemplate.execute("CREATE INDEX idx_projects_managed_by ON projects (managed_by)");
                    }

                    for (String indexName : uniqueIndexes) {
                        if (indexName.matches("[A-Za-z0-9_]+")) {
                            jdbcTemplate.execute("ALTER TABLE projects DROP INDEX " + indexName);
                            log.info("Dropped legacy unique index {} on projects.managed_by", indexName);
                        }
                    }
                }
            } catch (Exception ex) {
                log.warn("Could not drop legacy unique index on projects.managed_by: {}", ex.getMessage());
            }
        };
    }
}
