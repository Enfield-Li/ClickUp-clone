package com.example.taskComment;

import com.example.taskComment.model.TaskComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskCommentRepository
    extends JpaRepository<TaskComment, Integer> {}
