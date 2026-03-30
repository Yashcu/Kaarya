-- Replace full unique ordering constraints with partial ones that only apply to active rows.
-- This keeps archived boards/lists/cards from blocking future reorders.
DROP INDEX IF EXISTS "List_boardId_position_key";
DROP INDEX IF EXISTS "Card_listId_position_key";

CREATE UNIQUE INDEX "List_boardId_position_active_key"
ON "List" ("boardId", "position")
WHERE "isArchived" = false;

CREATE UNIQUE INDEX "Card_listId_position_active_key"
ON "Card" ("listId", "position")
WHERE "isArchived" = false;
