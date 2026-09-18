import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { ApiError } from '../api/client';
import { Button, Field } from '../components/ui';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setFormError(null);
        setFieldErrors({});

        try {
            await login(email, password);
            navigate('/', { replace: true });
        } catch (error) {
            if (error instanceof ApiError) {
                setFormError(error.message);
                setFieldErrors(error.fieldErrors);
            } else {
                setFormError('Une erreur inattendue est survenue.');
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-semibold text-slate-900">Task Manager</h1>
                <p className="mt-1 text-sm text-slate-600">Connectez-vous pour voir vos tâches.</p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    {formError && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                            {formError}
                        </p>
                    )}

                    <Field
                        id="email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={fieldErrors.email}
                        autoComplete="email"
                        required
                    />

                    <Field
                        id="password"
                        label="Mot de passe"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={fieldErrors.password}
                        autoComplete="current-password"
                        required
                    />

                    <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? 'Connexion…' : 'Se connecter'}
                    </Button>
                </form>

                <p className="mt-6 text-sm text-slate-600">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="font-medium text-slate-900 underline">
                        Créer un compte
                    </Link>
                </p>
            </div>
        </div>
    );
}