const router = require('express').Router();
const controller = require('../controllers/cardController');

router.post('/', controller.createCard);
router.get('/members', controller.getAllMembers);
router.get('/:id', controller.getCardById);
router.patch('/move', controller.reorderCards);
router.patch('/:id', controller.updateCard);
router.delete('/:id', controller.deleteCard);

router.post('/:id/labels', controller.createLabelForCard);
router.delete('/:id/labels/:labelId', controller.removeLabelFromCard);
router.post('/:id/members', controller.addMemberToCard);
router.delete('/:id/members/:memberId', controller.removeMemberFromCard);

router.post('/:id/checklists', controller.createChecklist);
router.post('/checklists/items', controller.addChecklistItem);
router.patch('/checklists/items/:itemId', controller.updateChecklistItem);
router.delete('/checklists/items/:itemId', controller.deleteChecklistItem);

module.exports = router;
