const { z } = require('zod');

const createBoardSchema = z.object({
    title: z.string().min(1),
    backgroundColor: z.string().optional(),
});

module.exports = {
    createBoardSchema,
};
