const { z } = require('zod');

const createCardSchema = z.object({
    title: z.string().min(1),
    listId: z.string().cuid(),
});

const updateCardSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    dueDate: z.string().datetime().nullable().optional(),
});

const reorderCardSchema = z.object({
    cardId: z.string().cuid(),
    newListId: z.string().cuid(),
    newPosition: z.number().int().min(1),
});

const createLabelForCardSchema = z.object({
    name: z.string().min(1),
    color: z.string().min(1),
});

const manageCardMemberSchema = z.object({
    memberId: z.string().cuid(),
});

const addChecklistSchema = z.object({
    title: z.string().min(1),
});

const deleteChecklistSchema = z.object({
    checklistId: z.string().cuid(),
});

const addChecklistItemSchema = z.object({
    text: z.string().min(1),
    checklistId: z.string().cuid(),
});

const updateChecklistItemSchema = z.object({
    text: z.string().optional(),
    isCompleted: z.boolean().optional(),
});

module.exports = {
    createCardSchema,
    updateCardSchema,
    reorderCardSchema,
    createLabelForCardSchema,
    manageCardMemberSchema,
    addChecklistSchema,
    deleteChecklistSchema,
    addChecklistItemSchema,
    updateChecklistItemSchema,
};
