const TEMP_POSITION_BASE = 1000;

function moveIdToPosition(ids, id, targetPosition) {
    const nextIds = ids.filter((currentId) => currentId !== id);
    const index = Math.max(0, Math.min(targetPosition - 1, nextIds.length));

    nextIds.splice(index, 0, id);
    return nextIds;
}

async function resequenceRows(tx, modelName, idsInOrder, tempBaseOverride) {
    if (!idsInOrder.length) {
        return;
    }

    const tempBase =
        tempBaseOverride ?? idsInOrder.length + TEMP_POSITION_BASE;

    // Move all rows out of the active position range first so unique indexes never clash.
    for (let index = 0; index < idsInOrder.length; index += 1) {
        await tx[modelName].update({
            where: { id: idsInOrder[index] },
            data: { position: tempBase + index + 1 },
        });
    }

    // Then write back the final dense ordering.
    for (let index = 0; index < idsInOrder.length; index += 1) {
        await tx[modelName].update({
            where: { id: idsInOrder[index] },
            data: { position: index + 1 },
        });
    }
}

module.exports = {
    moveIdToPosition,
    resequenceRows,
};
