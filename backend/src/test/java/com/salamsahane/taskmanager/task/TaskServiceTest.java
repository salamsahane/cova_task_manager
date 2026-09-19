package com.salamsahane.taskmanager.task;

import com.salamsahane.taskmanager.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private User alice;
    private User bob;

    @BeforeEach
    void setUp() {
        alice = new User("alice@example.com", "hash");
        bob = new User("bob@example.com", "hash");
    }

    @Test
    @DisplayName("findById renvoie la tâche quand elle appartient à l'utilisateur")
    void findById_returnsTask_whenOwned() {
        Task task = new Task("Réviser Spring", "JWT et filtres", alice);
        when(taskRepository.findByIdAndOwner(1L, alice)).thenReturn(Optional.of(task));

        TaskResponse response = taskService.findById(1L, alice);

        assertThat(response.title()).isEqualTo("Réviser Spring");
        assertThat(response.status()).isEqualTo(TaskStatus.OPEN);
    }

    @Test
    @DisplayName("findById lève une exception quand la tâche appartient à un autre utilisateur")
    void findById_throws_whenNotOwned() {
        when(taskRepository.findByIdAndOwner(1L, bob)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.findById(1L, bob))
                .isInstanceOf(TaskNotFoundException.class);
    }

    @Test
    @DisplayName("update refuse de modifier la tâche d'un autre utilisateur")
    void update_throwsAndChangesNothing_whenNotOwned() {
        when(taskRepository.findByIdAndOwner(1L, bob)).thenReturn(Optional.empty());

        UpdateTaskRequest request =
                new UpdateTaskRequest("Piraté", "tentative", TaskStatus.DONE);

        assertThatThrownBy(() -> taskService.update(1L, bob, request))
                .isInstanceOf(TaskNotFoundException.class);

        verify(taskRepository, never()).flush();
    }

    @Test
    @DisplayName("delete refuse de supprimer la tâche d'un autre utilisateur")
    void delete_throwsAndDeletesNothing_whenNotOwned() {
        when(taskRepository.findByIdAndOwner(1L, bob)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.delete(1L, bob))
                .isInstanceOf(TaskNotFoundException.class);

        verify(taskRepository, never()).delete(any(Task.class));
    }

    @Test
    @DisplayName("update modifie les champs et force le flush")
    void update_appliesChanges_whenOwned() {
        Task task = new Task("Ancien titre", "Ancienne description", alice);
        when(taskRepository.findByIdAndOwner(1L, alice)).thenReturn(Optional.of(task));

        UpdateTaskRequest request =
                new UpdateTaskRequest("Nouveau titre", "Nouvelle description", TaskStatus.DONE);

        TaskResponse response = taskService.update(1L, alice, request);

        assertThat(response.title()).isEqualTo("Nouveau titre");
        assertThat(response.description()).isEqualTo("Nouvelle description");
        assertThat(response.status()).isEqualTo(TaskStatus.DONE);
        verify(taskRepository).flush();
    }

    @Test
    @DisplayName("delete supprime la tâche quand elle appartient à l'utilisateur")
    void delete_removesTask_whenOwned() {
        Task task = new Task("À supprimer", null, alice);
        when(taskRepository.findByIdAndOwner(1L, alice)).thenReturn(Optional.of(task));

        taskService.delete(1L, alice);

        verify(taskRepository).delete(task);
    }

    @Test
    @DisplayName("create associe la tâche à l'utilisateur connecté")
    void create_assignsOwner() {
        CreateTaskRequest request = new CreateTaskRequest("Nouvelle tâche", "Description");
        when(taskRepository.save(any(Task.class))).thenAnswer(call -> call.getArgument(0));

        taskService.create(request, alice);

        ArgumentCaptor<Task> captor = ArgumentCaptor.forClass(Task.class);
        verify(taskRepository).save(captor.capture());

        Task saved = captor.getValue();
        assertThat(saved.getOwner()).isEqualTo(alice);
        assertThat(saved.getTitle()).isEqualTo("Nouvelle tâche");
        assertThat(saved.getStatus()).isEqualTo(TaskStatus.OPEN);
    }

    @Test
    @DisplayName("findAll ne consulte que les tâches de l'utilisateur connecté")
    void findAll_scopesToOwner() {
        Task task = new Task("Ma tâche", null, alice);
        when(taskRepository.search(alice, TaskStatus.OPEN, "ma")).thenReturn(List.of(task));

        List<TaskResponse> responses = taskService.findAll(alice, TaskStatus.OPEN, "ma");

        assertThat(responses).hasSize(1);
        verify(taskRepository).search(alice, TaskStatus.OPEN, "ma");
    }
}