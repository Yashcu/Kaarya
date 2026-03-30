import { useState } from 'react';
import { createPortal } from 'react-dom';

import { useEscapeKey } from '../../hooks/useEscapeKey';
import CardModalHeader from './CardModalHeader';
import CardChecklistSection from './CardChecklistSection';
import CardDueDateSection from './CardDueDateSection';
import CardMembersSection from './CardMembersSection';
import CardLabelsSection from './CardLabelsSection';
import { useCardModal } from './useCardModal';
import { ConfirmDialog } from '@/shared/components/ui';

export default function CardModal({ card, onClose }) {
    const [pendingChecklistDelete, setPendingChecklistDelete] = useState(null);
    const {
        title,
        setTitle,
        description,
        setDescription,
        dueDate,
        setDueDate,
        newChecklistTitle,
        setNewChecklistTitle,
        newLabelName,
        setNewLabelName,
        selectedLabelColor,
        setSelectedLabelColor,
        allMembers,
        itemDrafts,
        editDrafts,
        actionError,
        liveCard,
        completedCount,
        totalCount,
        handleCreateChecklist,
        handleDeleteChecklist,
        handleAddChecklistItem,
        handleUpdateChecklistText,
        handleToggleChecklistItem,
        handleDeleteChecklistItem,
        handleCreateLabel,
        handleRemoveLabel,
        handleToggleMember,
        handleClearDueDate,
        handleDueDateChange,
        handleItemDraftChange,
        handleEditDraftChange,
        saveBasicInfo,
        labelColors,
    } = useCardModal(card);

    useEscapeKey(onClose);

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
            onClick={onClose}
        >
            <div
                className="flex h-[100dvh] w-full max-w-none flex-col overflow-hidden rounded-none bg-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:rounded-3xl"
                onClick={(e) => e.stopPropagation()}
            >
                <CardModalHeader
                    title={title}
                    onTitleChange={setTitle}
                    onTitleBlur={saveBasicInfo}
                    onClose={onClose}
                />

                <div className="flex-1 overflow-y-auto">
                    <div className="grid gap-0 lg:grid-cols-[minmax(0,1.55fr)_360px]">
                        <div className="space-y-5 p-4 sm:space-y-6 sm:p-5 lg:p-6">
                            {actionError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                    {actionError}
                                </div>
                            )}

                            <section className="space-y-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                    Description
                                </div>
                                <textarea
                                    className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 sm:p-4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    onBlur={saveBasicInfo}
                                    placeholder="Add a more detailed description..."
                                />
                            </section>

                            <CardChecklistSection
                                checklists={liveCard.checklists || []}
                                completedCount={completedCount}
                                totalCount={totalCount}
                                newChecklistTitle={newChecklistTitle}
                                onNewChecklistTitleChange={setNewChecklistTitle}
                                onCreateChecklist={handleCreateChecklist}
                                onRequestDeleteChecklist={setPendingChecklistDelete}
                                itemDrafts={itemDrafts}
                                onItemDraftChange={handleItemDraftChange}
                                onAddChecklistItem={handleAddChecklistItem}
                                editDrafts={editDrafts}
                                onEditDraftChange={handleEditDraftChange}
                                onUpdateChecklistText={handleUpdateChecklistText}
                                onToggleChecklistItem={handleToggleChecklistItem}
                                onDeleteChecklistItem={handleDeleteChecklistItem}
                            />
                        </div>

                        <aside className="space-y-5 border-t bg-slate-50 p-4 sm:space-y-6 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
                            <CardDueDateSection
                                dueDate={dueDate}
                                onDueDateChange={handleDueDateChange}
                                onClearDueDate={handleClearDueDate}
                            />

                            <CardMembersSection
                                members={liveCard.members || []}
                                availableMembers={allMembers}
                                onToggleMember={handleToggleMember}
                            />

                            <CardLabelsSection
                                labels={liveCard.labels || []}
                                newLabelName={newLabelName}
                                onNewLabelNameChange={setNewLabelName}
                                selectedLabelColor={selectedLabelColor}
                                onSelectedLabelColorChange={setSelectedLabelColor}
                                labelColors={labelColors}
                                onCreateLabel={handleCreateLabel}
                                onRemoveLabel={handleRemoveLabel}
                            />
                        </aside>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={!!pendingChecklistDelete}
                title="Delete checklist?"
                description={`This will permanently delete "${pendingChecklistDelete?.title || 'this checklist'}" and all of its items.`}
                confirmLabel="Delete checklist"
                onCancel={() => setPendingChecklistDelete(null)}
                onConfirm={async () => {
                    if (!pendingChecklistDelete) return;
                    await handleDeleteChecklist(pendingChecklistDelete.id);
                    setPendingChecklistDelete(null);
                }}
            />
        </div>,
        document.body
    );
}
