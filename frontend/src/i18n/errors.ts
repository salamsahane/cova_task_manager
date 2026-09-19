const FIELD_ERRORS: Record<string, string> = {
    'must not be blank': 'Ce champ est obligatoire.',
    'must not be null': 'Ce champ est obligatoire.',
    'must not be empty': 'Ce champ est obligatoire.',
    'must be a well-formed email address': "Format d'email invalide.",
};

const MESSAGES: Record<string, string> = {
    'Invalid email or password': 'Email ou mot de passe incorrect.',
    'Email Already Used': 'Cet email est déjà utilisé.',
    'Validation failed': 'Veuillez corriger les champs signalés.',
    'Malformed request body or invalid field value': 'Données envoyées invalides.',
};

export function translateFieldError(message: string): string {
    if (FIELD_ERRORS[message]) {
        return FIELD_ERRORS[message];
    }

    const size = message.match(/^size must be between (\d+) and (\d+)$/);
    if (size) {
        return `Entre ${size[1]} et ${size[2]} caractères.`;
    }

    const max = message.match(/^size must be between 0 and (\d+)$/);
    if (max) {
        return `${max[1]} caractères maximum.`;
    }

    return message;
}

export function translateMessage(message: string): string {
    if (MESSAGES[message]) {
        return MESSAGES[message];
    }

    if (/^Task with id \d+ not found$/.test(message)) {
        return 'Cette tâche est introuvable.';
    }

    if (/^Invalid value for parameter/.test(message)) {
        return 'Paramètre de recherche invalide.';
    }

    return message;
}

export function translateFieldErrors(
    errors: Record<string, string>,
): Record<string, string> {
    return Object.fromEntries(
        Object.entries(errors).map(([field, message]) => [field, translateFieldError(message)]),
    );
}