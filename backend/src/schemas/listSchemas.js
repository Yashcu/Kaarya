const { z } = require('zod');

const createListSchema = z.object({
    title: z.string().min(1),
    boardId: z.string().cuid(),
});

module.exports = {
    createListSchema,
};
