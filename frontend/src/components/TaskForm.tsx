import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Task, TaskStatus } from '../types/api';
import { Button, Field } from './ui';

type TaskFormProps = {
    editing: Task | null;
    submitting: boolean;
    fieldErrors: Record<string, string>;
    onSubmit: (values: { title: string; description: string; status: TaskStatus }) => void;
    onCancel: () => void;
};

export function TaskForm({ editing, submitting, fieldErrors, onSubmit, onCancel }: TaskFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('OPEN');

    useEffect(() => {
        setTitle(editing?.title ?? '');
        setDescription(editing?.description ?? '');
        setStatus(editing?.status ?? 'OPEN');
    }, [editing]);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSubmit({ title, description, status });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-slate-900">
                {editing ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h2>

            <Field
                id="title"
                label="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={fieldErrors.title}
                maxLength={200}
                required
            />

            <div className="space-y-1.5">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={2000}
                    rows={3}
                    className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-slate-900
            outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
                {fieldErrors.description && (
                    <p className="text-sm text-red-600">{fieldErrors.description}</p>
                )}
            </div>

            {editing && (
                <div className="space-y-1.5">
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                        Statut
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900
              outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    >
                        <option value="OPEN">À faire</option>
                        <option value="IN_PROGRESS">En cours</option>
                        <option value="DONE">Terminée</option>
                    </select>
                </div>
            )}

            <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Ajouter la tâche'}
                </Button>
                {editing && (
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Annuler
                    </Button>
                )}
            </div>
        </form>
    );
}