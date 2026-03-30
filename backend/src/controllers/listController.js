const asyncHandler = require('express-async-handler');
const { createListSchema } = require('../schemas/listSchemas');
const listService = require('../services/list');

exports.createList = asyncHandler(async (req, res) => {
    const data = createListSchema.parse(req.body);
    const list = await listService.createList(data);

    res.status(201).json({ success: true, data: list });
});

exports.updateList = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const list = await listService.updateList(req.params.id, { title });

    res.json({ success: true, data: list });
});

exports.deleteList = asyncHandler(async (req, res) => {
    await listService.deleteList(req.params.id);

    res.json({ success: true, message: 'List archived' });
});

exports.reorderLists = asyncHandler(async (req, res) => {
    const { listId, newPosition } = req.body;

    if (!listId || newPosition === undefined) {
        throw { status: 400, message: 'Missing listId or newPosition' };
    }

    const result = await listService.reorderLists({ listId, newPosition });
    res.json({ success: true, message: result.message });
});
