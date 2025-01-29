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
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">{t('editRecipe.instructions.title')}</h2>
        <button
          type="button"
          onClick={addInstructionGroup}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
        >
          <Plus className="w-4 h-4" />
          {t('editRecipe.instructions.addGroup')}
        </button>
      </div>

      <SortableList 
        items={instructionGroups}
        setItems={setInstructionGroups}
        renderItem={(group: InstructionGroup, groupIndex: number) => (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={group.title}
                onChange={(e) => {
                  const newGroups = [...instructionGroups];
                  newGroups[groupIndex].title = e.target.value;
                  setInstructionGroups(newGroups);
                }}
                placeholder={t('editRecipe.instructions.groupTitlePlaceholder')}
                className="font-semibold text-lg px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {instructionGroups.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstructionGroup(groupIndex)}
                  className="p-2 text-red-500 hover:text-red-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="pl-4 space-y-4">
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
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    {group.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstructionFromGroup(groupIndex, instructionIndex)}
                        className="p-2 text-red-500 hover:text-red-600"
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
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 ml-4"
              >
                <Plus className="w-4 h-4" />
                {t('editRecipe.instructions.addToGroup')}
              </button>
            </div>
          </div>
        )}
      />
  </div>
  );
};
  
export default InstructionsSection;