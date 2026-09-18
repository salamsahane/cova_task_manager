package com.salamsahane.taskmanager.task;

import com.salamsahane.taskmanager.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> findAll(User owner, TaskStatus status, String q) {
        return taskRepository.search(owner, status, q)
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse findById(Long id, User owner) {
        return TaskResponse.from(getTaskOrThrow(id, owner));
    }

    @Transactional
    public TaskResponse create(CreateTaskRequest request, User owner) {
        Task saved = taskRepository.save(new Task(request.title(), request.description(), owner));
        return TaskResponse.from(saved);
    }

    @Transactional
    public TaskResponse update(Long id, User owner, UpdateTaskRequest request) {
        Task task = getTaskOrThrow(id, owner);

        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setStatus(request.status());

        taskRepository.flush();

        return TaskResponse.from(task);
    }

    @Transactional
    public void delete(Long id, User owner) {
        taskRepository.delete(getTaskOrThrow(id, owner));
    }

    private Task getTaskOrThrow(Long id, User owner) {
        return taskRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new TaskNotFoundException(id));
    }
}