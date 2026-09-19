import type {Task, TaskStatus} from '../types/api';
import {Button} from './ui';

const STATUS_LABELS: Record<TaskStatus, string> = {
    OPEN: 'À faire',
    IN_PROGRESS: 'En cours',
    DONE: 'Terminée',
};

const STATUS_STYLES: Record<TaskStatus, string> = {
    OPEN: 'bg-slate-100 text-slate-700',
    IN_PROGRESS: 'bg-amber-100 text-amber-800',
    DONE: 'bg-emerald-100 text-emerald-800',
};

type TaskListProps = {
    tasks: Task[];
    loading: boolean;
    deletingId: number | null;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
};

export function TaskList({tasks, loading, deletingId, onEdit, onDelete}: TaskListProps) {
    if (loading) {
        return <p className="py-10 text-center text-sm text-slate-500">Chargement…</p>;
    }

    if (tasks.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 py-12 text-center">
                <p className="text-sm text-slate-600">Aucune tâche à afficher.</p>
                <p className="mt-1 text-sm text-slate-500">
                    Ajoutez-en une, ou modifiez vos filtres.
                </p>
            </div>
        );
    }

    return (
        <ul className="space-y-3">
            {tasks.map((task) => (
                <li
                    key={task.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h3 className="font-medium text-slate-900">{task.title}</h3>
                            {task.description && (
                                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                                    {task.description}
                                </p>
                            )}
                            <p className="mt-2 text-xs text-slate-400">
                                Créée le{' '}
                                {new Date(task.createdAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </p>
                        </div>

                        <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[task.status]}`}
                        >
                          {STATUS_LABELS[task.status]}
                        </span>
                    </div>

                    <div className="mt-3 flex gap-2">
                        {STATUS_LABELS[task.status] != STATUS_LABELS.DONE && (<Button variant="secondary" onClick={() => onEdit(task)}>
                            Modifier
                        </Button>)}
                        <Button
                            variant="danger"
                            onClick={() => onDelete(task)}
                            disabled={deletingId === task.id}
                        >
                            {deletingId === task.id ? 'Suppression…' : 'Supprimer'}
                        </Button>
                    </div>
                </li>
            ))}
        </ul>
    );
}