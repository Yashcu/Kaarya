const asyncHandler = require('express-async-handler');
const cardService = require('../services/cardService');
const {
  createCardSchema,
  updateCardSchema,
  reorderCardSchema,
  createLabelForCardSchema,
  manageCardMemberSchema,
  addChecklistSchema,
  addChecklistItemSchema,
  updateChecklistItemSchema,
} = require('../schemas/cardSchemas');

exports.getCardById = asyncHandler(async (req, res) => {
  const card = await cardService.getCardById(req.params.id);

  if (!card) {
    throw { status: 404, message: 'Card not found' };
  }

  res.json({ success: true, data: card });
});

exports.getAllMembers = asyncHandler(async (req, res) => {
  const members = await cardService.getAllMembers();
  res.json({ success: true, data: members });
});

exports.createCard = asyncHandler(async (req, res) => {
  const { title, listId } = createCardSchema.parse(req.body);
  const card = await cardService.createCard({ title, listId });

  res.status(201).json({ success: true, data: card });
});

exports.updateCard = asyncHandler(async (req, res) => {
  const data = updateCardSchema.parse(req.body);
  const card = await cardService.updateCard(req.params.id, data);

  res.json({ success: true, data: card });
});

exports.deleteCard = asyncHandler(async (req, res) => {
  await cardService.deleteCard(req.params.id);

  res.json({ success: true, message: 'Card archived' });
});

exports.reorderCards = asyncHandler(async (req, res) => {
  const data = reorderCardSchema.parse(req.body);
  const result = await cardService.reorderCards(data);

  res.json({ success: true, message: result.message });
});

exports.createLabelForCard = asyncHandler(async (req, res) => {
  const { name, color } = createLabelForCardSchema.parse(req.body);
  const label = await cardService.createLabelForCard(req.params.id, { name, color });

  res.status(201).json({
    success: true,
    data: {
      label,
    },
  });
});

exports.addMemberToCard = asyncHandler(async (req, res) => {
  const { memberId } = manageCardMemberSchema.parse(req.body);
  const cardMember = await cardService.addMemberToCard(req.params.id, memberId);

  res.status(201).json({ success: true, data: cardMember });
});

exports.removeMemberFromCard = asyncHandler(async (req, res) => {
  const result = await cardService.removeMemberFromCard(req.params.id, req.params.memberId);

  res.json({ success: true, message: result.message });
});

exports.removeLabelFromCard = asyncHandler(async (req, res) => {
  const result = await cardService.removeLabelFromCard(req.params.id, req.params.labelId);

  res.json({ success: true, message: result.message });
});

exports.createChecklist = asyncHandler(async (req, res) => {
  const { title } = addChecklistSchema.parse(req.body);
  const checklist = await cardService.createChecklist(req.params.id, title);

  res.status(201).json({ success: true, data: checklist });
});

exports.addChecklistItem = asyncHandler(async (req, res) => {
  const { text, checklistId } = addChecklistItemSchema.parse(req.body);
  const item = await cardService.addChecklistItem(text, checklistId);

  res.status(201).json({ success: true, data: item });
});

exports.updateChecklistItem = asyncHandler(async (req, res) => {
  const data = updateChecklistItemSchema.parse(req.body);
  const item = await cardService.updateChecklistItem(req.params.itemId, data);

  res.json({ success: true, data: item });
});

exports.deleteChecklistItem = asyncHandler(async (req, res) => {
  await cardService.deleteChecklistItem(req.params.itemId);

  res.json({ success: true, message: 'Checklist item deleted' });
});
