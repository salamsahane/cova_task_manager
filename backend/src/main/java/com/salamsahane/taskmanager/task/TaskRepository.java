package com.salamsahane.taskmanager.task;

import com.salamsahane.taskmanager.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Optional<Task> findByIdAndOwner(Long id, User owner);

    @Query("""
        SELECT t FROM Task t
        WHERE t.owner = :owner
          AND (:status IS NULL OR t.status = :status)
          AND (:q IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :q, '%'))
                          OR LOWER(t.description) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY t.createdAt DESC
        """)
    List<Task> search(@Param("owner") User owner, @Param("status") TaskStatus status, @Param("q") String q);
}
