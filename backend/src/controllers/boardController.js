const asyncHandler = require('express-async-handler');
const { createBoardSchema } = require('../schemas/boardSchemas');
const boardService = require('../services/boardService');

exports.getAllBoards = asyncHandler(async (req, res) => {
    const boards = await boardService.getAllBoards();
    res.json({ success: true, data: boards });
});

exports.getBoardById = asyncHandler(async (req, res) => {
    const board = await boardService.getBoardById(req.params.id);

    if (!board) {
        throw { status: 404, message: 'Board not found' };
    }

    res.json({ success: true, data: board });
});

exports.createBoard = asyncHandler(async (req, res) => {
    const data = createBoardSchema.parse(req.body);
    const board = await boardService.createBoard(data);

    res.status(201).json({ success: true, data: board });
});

exports.updateBoard = asyncHandler(async (req, res) => {
    const { title, backgroundColor } = req.body;
    const board = await boardService.updateBoard(req.params.id, { title, backgroundColor });

    res.json({ success: true, data: board });
});

exports.deleteBoard = asyncHandler(async (req, res) => {
    await boardService.deleteBoard(req.params.id);

    res.json({ success: true, message: 'Board archived' });
});
