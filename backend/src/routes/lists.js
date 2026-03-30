const router = require('express').Router();
const controller = require('../controllers/listController');

router.post('/', controller.createList);
router.patch('/reorder', controller.reorderLists);
router.patch('/:id', controller.updateList);
router.delete('/:id', controller.deleteList);

module.exports = router;
