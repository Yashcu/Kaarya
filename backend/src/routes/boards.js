const router = require('express').Router();
const controller = require('../controllers/boardController');

router.get('/', controller.getAllBoards);
router.post('/', controller.createBoard);
router.get('/:id', controller.getBoardById);
router.patch('/:id', controller.updateBoard);
router.delete('/:id', controller.deleteBoard);

module.exports = router;