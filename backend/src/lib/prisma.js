const { PrismaClient } = require('@prisma/client');

// Configure connection pool for production
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
    // Enable query logging in development/debug mode
    log: process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production'
        ? ['query', 'info', 'warn', 'error']
        : ['error', 'warn'],
});

// Log slow queries (only in debug mode)
if (process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production') {
    prisma.$on('query', (e) => {
        const duration = e.duration;
        if (duration > 1000) { // Log queries taking more than 1 second
            console.warn(`[SLOW QUERY] ${duration}ms: ${e.query}`);
        }
    });
}

module.exports = prisma;
