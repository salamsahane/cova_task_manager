import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '../api/client';
import { createTask, deleteTask, listTasks, updateTask } from '../api/tasks';
import { useAuth } from '../auth/AuthContext';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { Button } from '../components/ui';
import type { Task, TaskStatus } from '../types/api';

const FILTERS: { value: TaskStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'Toutes' },
    { value: 'OPEN', label: 'À faire' },
    { value: 'IN_PROGRESS', label: 'En cours' },
    { value: 'DONE', label: 'Terminées' },
];

export function TasksPage() {
    const { logout } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [editing, setEditing] = useState<Task | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Debounce de la recherche
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 350);
        return () => clearTimeout(timer);
    }, [search]);

    // Chargement de la liste
    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        listTasks(
            statusFilter === 'ALL' ? undefined : statusFilter,
            debouncedSearch.trim() || undefined,
        )
            .then((data) => {
                if (!cancelled) setTasks(data);
            })
            .catch((error) => {
                if (cancelled) return;
                if (error instanceof ApiError && error.status === 401) {
                    logout();
                    return;
                }
                toast.error('Impossible de charger les tâches.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [statusFilter, debouncedSearch, logout]);

    const reload = useCallback(async () => {
        const data = await listTasks(
            statusFilter === 'ALL' ? undefined : statusFilter,
            debouncedSearch.trim() || undefined,
        );
        setTasks(data);
    }, [statusFilter, debouncedSearch]);

    async function handleSubmit(values: { title: string; description: string; status: TaskStatus }) {
        setSubmitting(true);
        setFieldErrors({});

        try {
            if (editing) {
                await updateTask(editing.id, {
                    title: values.title,
                    description: values.description,
                    status: values.status,
                });
                toast.success('Tâche modifiée.');
                setEditing(null);
            } else {
                await createTask({ title: values.title, description: values.description });
                toast.success('Tâche ajoutée.');
            }
            await reload();
        } catch (error) {
            if (error instanceof ApiError) {
                setFieldErrors(error.fieldErrors);
                toast.error(error.message);
            } else {
                toast.error('Une erreur inattendue est survenue.');
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(task: Task) {
        if (!window.confirm(`Supprimer « ${task.title} » ?`)) return;

        setDeletingId(task.id);
        try {
            await deleteTask(task.id);
            if (editing?.id === task.id) setEditing(null);
            toast.success('Tâche supprimée.');
            await reload();
        } catch {
            toast.error('La suppression a échoué.');
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
                    <h1 className="text-lg font-semibold text-slate-900">Mes tâches</h1>
                    <Button variant="secondary" onClick={logout}>
                        Se déconnecter
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
                <TaskForm
                    editing={editing}
                    submitting={submitting}
                    fieldErrors={fieldErrors}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setEditing(null);
                        setFieldErrors({});
                    }}
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setStatusFilter(filter.value)}
                                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition
                  focus:outline-none focus:ring-2 focus:ring-slate-900/20
                  ${
                                    statusFilter === filter.value
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher…"
                        aria-label="Rechercher dans les tâches"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900
              outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 sm:w-56"
                    />
                </div>

                <TaskList
                    tasks={tasks}
                    loading={loading}
                    deletingId={deletingId}
                    onEdit={(task) => {
                        setEditing(task);
                        setFieldErrors({});
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onDelete={handleDelete}
                />
            </main>
        </div>
    );
}