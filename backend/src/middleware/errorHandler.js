const { ZodError } = require('zod');

module.exports = (err, req, res, next) => {
    console.error(err);

    // Zod Validation Error
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.errors,
        });
    }

    // Prisma errors (basic handling)
    if (err.code && err.code.startsWith("P")) {
        return res.status(400).json({
            success: false,
            message: "Database error",
        });
    }

    // Default error
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
