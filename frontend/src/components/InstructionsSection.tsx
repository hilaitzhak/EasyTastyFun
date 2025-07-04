
import { useTranslation } from "react-i18next";
import { InstructionGroup, InstructionsSectionProps } from "../interfaces/Recipe";
import { Minus, Plus } from "lucide-react";
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
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100/50 p-8 transition-all hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">{t('editRecipe.instructions.title')}</h2>
        <button
          type="button"
          onClick={addInstructionGroup}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('editRecipe.instructions.addGroup')}
        </button>
      </div>

      <div className="space-y-6">
        {instructionGroups.map((group: InstructionGroup, groupIndex: number) => (
          <div key={groupIndex} className="bg-orange-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={group.title}
                onChange={(e) => {
                  const newGroups = [...instructionGroups];
                  newGroups[groupIndex].title = e.target.value;
                  setInstructionGroups(newGroups);
                }}
                placeholder={t('editRecipe.instructions.groupTitlePlaceholder')}
                className="font-semibold text-lg px-4 py-2 rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
              />
              {instructionGroups.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstructionGroup(groupIndex)}
                  className="p-2 text-red-500 hover:text-red-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
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
                <div className="flex gap-4 items-start">
                  <span className="mt-3 text-gray-500 font-medium">{instructionIndex + 1}.</span>
                  <div className="flex-1">
                    <textarea
                      value={instruction.content}
                      onChange={(e) => {
                        const newGroups = [...instructionGroups];
                        newGroups[groupIndex].instructions[instructionIndex].content = e.target.value;
                        setInstructionGroups(newGroups);
                      }}
                      placeholder={t('editRecipe.instructions.stepPlaceholder', { number: instructionIndex + 1 })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
                    />
                  </div>
                  {group.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstructionFromGroup(groupIndex, instructionIndex)}
                      className="p-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            />
            <button
              type="button"
              onClick={() => addInstructionToGroup(groupIndex)}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('editRecipe.instructions.addToGroup')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
  
export default InstructionsSection;