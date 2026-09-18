import { useAuth } from '../auth/AuthContext';

export function TasksPage() {
    const { logout } = useAuth();

    return (
        <div className="p-8">
            <p className="text-slate-900">Mes tâches</p>
            <button onClick={logout} className="mt-4 rounded-md bg-slate-900 px-3 py-2 text-white">
                Se déconnecter
            </button>
        </div>
    );
}