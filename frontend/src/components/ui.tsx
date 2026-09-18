import type { InputHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export function Field({ label, error, id, ...inputProps }: FieldProps) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                id={id}
                {...inputProps}
                aria-invalid={error ? true : undefined}
                className={`w-full rounded-lg border px-3 py-2 text-slate-900 outline-none
          transition focus:ring-2 focus:ring-slate-900/10
          ${error ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-slate-900'}`}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger';
    children: ReactNode;
};

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
    const styles = {
        primary: 'bg-slate-900 text-white hover:bg-slate-800',
        secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
        danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
    };

    return (
        <button
            {...props}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition
        disabled:cursor-not-allowed disabled:opacity-50
        focus:outline-none focus:ring-2 focus:ring-slate-900/20
        ${styles[variant]} ${className}`}
        >
            {children}
        </button>
    );
}