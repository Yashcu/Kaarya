// Board Background Colors
export const BOARD_BACKGROUND_COLORS = [
    '#0f172a',
    '#0079bf',
    '#519839',
    '#d29034',
    '#b04632',
    '#89609e',
    '#cd5a91',
];

export const LABEL_COLORS = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#3b82f6',
    '#a855f7',
    '#ec4899',
    '#14b8a6',
];

// Cache times
export const CACHE_TIMES = {
    BOARD: 30000, // 30 seconds
    CARDS: 30000,
    MEMBERS: 30000,
};

// API pagination
export const PAGINATION = {
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 100,
};

// Reorder constants
export const REORDER = {
    POSITION_TEMP: -1, // Temporary position to avoid unique constraint
};

// Error messages
export const ERROR_MESSAGES = {
    DEFAULT: 'Something went wrong',
    NETWORK: 'Network error. Please check your connection.',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized',
    VALIDATION: 'Validation failed',
};

// Success messages
export const SUCCESS_MESSAGES = {
    BOARD_CREATED: 'Board created successfully',
    BOARD_UPDATED: 'Board updated successfully',
    BOARD_DELETED: 'Board deleted',
    LIST_CREATED: 'List created',
    LIST_UPDATED: 'List updated',
    LIST_DELETED: 'List deleted',
    CARD_CREATED: 'Card created',
    CARD_UPDATED: 'Card updated',
    CARD_DELETED: 'Card deleted',
    CARD_MOVED: 'Card moved',
    LIST_REORDERED: 'Lists reordered',
};

// UI constants
export const UI = {
    DEBOUNCE_DELAY: 300,
    AUTO_SAVE_DELAY: 1000,
    TOAST_DURATION: 3000,
    DROP_INDICATOR_OFFSET: 8,
};
