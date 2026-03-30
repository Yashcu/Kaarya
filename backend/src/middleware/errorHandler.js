const { ZodError } = require('zod');

module.exports = (err, req, res, next) => {
    console.error(err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.issues ?? [],
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: 'Record not found',
        });
    }

    if (err.code === 'P2002' || (err.code === 'P2010' && err.meta?.code === '23505')) {
        return res.status(409).json({
            success: false,
            message: 'A record with conflicting unique values already exists. Please retry the action.',
        });
    }

    if (err.code && err.code.startsWith('P')) {
        return res.status(400).json({
            success: false,
            message: 'Database error',
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
};
