export const createEmptyFilters = () => ({
    labels: [],
    members: [],
    hasDueDate: false,
});

export const hasActiveFilters = (searchQuery, activeFilters) =>
    Boolean(searchQuery) ||
    activeFilters.labels.length > 0 ||
    activeFilters.members.length > 0 ||
    activeFilters.hasDueDate;

export const countActiveFilters = (activeFilters) =>
    activeFilters.labels.length +
    activeFilters.members.length +
    (activeFilters.hasDueDate ? 1 : 0);

function getCardLabelIds(card) {
    return (card.labels || [])
        .map((label) => label?.id)
        .filter(Boolean);
}

function getCardMemberNames(card) {
    return (card.members || [])
        .map((entry) => entry.member?.name ?? entry.name)
        .filter(Boolean);
}

function matchesCardFilters(card, searchQuery, activeFilters) {
    const cardTitle = (card.title || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = !searchQuery || cardTitle.includes(query);
    const cardLabels = getCardLabelIds(card);
    const matchesLabels =
        activeFilters.labels.length === 0 ||
        activeFilters.labels.every((labelId) => cardLabels.includes(labelId));

    const cardMembers = getCardMemberNames(card);
    const matchesMembers =
        activeFilters.members.length === 0 ||
        activeFilters.members.every((member) => cardMembers.includes(member));

    const matchesDueDate = !activeFilters.hasDueDate || Boolean(card.dueDate);

    return matchesSearch && matchesLabels && matchesMembers && matchesDueDate;
}

export function filterListsByBoardFilters(lists, searchQuery, activeFilters) {
    if (!hasActiveFilters(searchQuery, activeFilters)) return lists;

    return lists.map((list) => ({
        ...list,
        cards: (list.cards || []).filter((card) =>
            matchesCardFilters(card, searchQuery, activeFilters)
        ),
    }));
}
