package com.salamsahane.taskmanager.task;

import com.salamsahane.taskmanager.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> findAll(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String q) {
        return taskService.findAll(currentUser, status, q);
    }

    @GetMapping("/{id}")
    public TaskResponse findById(@PathVariable Long id, @AuthenticationPrincipal User currentUser) {
        return taskService.findById(id, currentUser);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody CreateTaskRequest request,  @AuthenticationPrincipal User currentUser) {
        TaskResponse created = taskService.create(request, currentUser);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public TaskResponse update(@PathVariable Long id, @AuthenticationPrincipal User currentUser, @Valid @RequestBody UpdateTaskRequest request) {
        return taskService.update(id, currentUser, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id,  @AuthenticationPrincipal User currentUser) {
        taskService.delete(id,  currentUser);
    }
}
