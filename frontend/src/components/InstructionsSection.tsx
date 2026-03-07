
import { useTranslation } from "react-i18next";
import { InstructionGroup, InstructionsSectionProps } from "../interfaces/Recipe";
import { Minus, Plus, ListOrdered, Trash2 } from "lucide-react";
import SortableList from "./SortableList";

function InstructionsSection({ instructionGroups, setInstructionGroups }: InstructionsSectionProps) {
  const { t } = useTranslation();

  const addInstructionGroup = () => {
    setInstructionGroups([...instructionGroups, { title: '', instructions: [{ content: '' }] }]);
  };
  
  const removeInstructionGroup = (groupIndex: number) => {
    setInstructionGroups(instructionGroups.filter((_: any, i: number) => i !== groupIndex));
  };
  
  const addInstructionToGroup = (groupIndex: number) => {
    const newGroups = [...instructionGroups];
    newGroups[groupIndex].instructions.push({ content: '' });
    setInstructionGroups(newGroups);
  };
  
  const removeInstructionFromGroup = (groupIndex: number, instructionIndex: number) => {
    const newGroups = [...instructionGroups];
    newGroups[groupIndex].instructions = newGroups[groupIndex].instructions.filter(
      (_, i) => i !== instructionIndex
    );
    setInstructionGroups(newGroups);
  };
  
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-50 flex items-center justify-center">
            <ListOrdered className="w-4 h-4 text-accent-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{t('editRecipe.instructions.title')}</h2>
        </div>
        <button
          type="button"
          onClick={addInstructionGroup}
          className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('editRecipe.instructions.addGroup')}
        </button>
      </div>

      <div className="space-y-4">
        {instructionGroups.map((group: InstructionGroup, groupIndex: number) => (
          <div key={groupIndex} className="bg-surface-muted rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={group.title}
                onChange={(e) => {
                  const newGroups = [...instructionGroups];
                  newGroups[groupIndex].title = e.target.value;
                  setInstructionGroups(newGroups);
                }}
                placeholder={t('editRecipe.instructions.groupTitlePlaceholder')}
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-colors"
              />
              {instructionGroups.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstructionGroup(groupIndex)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <SortableList
              items={group.instructions}
              setItems={(newInstructions) => {
                const newGroups = [...instructionGroups];
                newGroups[groupIndex].instructions = newInstructions;
                setInstructionGroups(newGroups);
              }}
              groupId={`instruction-group-${groupIndex}`}
              renderItem={(instruction, instructionIndex) => (
                <div className="flex gap-3 items-start w-full">
                  <span className="mt-2.5 w-6 h-6 flex-shrink-0 rounded-full bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center">
                    {instructionIndex + 1}
                  </span>
                  <div className="flex-1">
                    <textarea
                      value={instruction.content}
                      onChange={(e) => {
                        const newGroups = [...instructionGroups];
                        newGroups[groupIndex].instructions[instructionIndex].content = e.target.value;
                        setInstructionGroups(newGroups);
                      }}
                      placeholder={t('editRecipe.instructions.stepPlaceholder', { number: instructionIndex + 1 })}
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-colors resize-none"
                    />
                  </div>
                  {group.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstructionFromGroup(groupIndex, instructionIndex)}
                      className="mt-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            />

            <button
              type="button"
              onClick={() => addInstructionToGroup(groupIndex)}
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors pt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('editRecipe.instructions.addToGroup')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
  
export default InstructionsSection;