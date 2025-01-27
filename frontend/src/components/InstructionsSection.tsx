import { useTranslation } from "react-i18next";
import { InstructionsSectionProps } from "../interfaces/Recipe";
import { Minus, Plus } from "lucide-react";

function InstructionsSection({ instructions, setInstructions }: InstructionsSectionProps) {
  const { t } = useTranslation();
  
  const addInstruction = () => {
      setInstructions([...instructions, '']);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {t('createRecipe.instructions.title')}
        </h2>
        <button
          type="button"
          onClick={addInstruction}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
        >
          <Plus className="w-4 h-4" />
          {t('createRecipe.instructions.addStep')}
        </button>
      </div>

      {instructions.map((instruction, index) => (
        <div key={index} className="flex gap-4 items-start mb-4">
          <span className="mt-3 text-gray-500 font-medium">{index + 1}.</span>
          <div className="flex-1">
            <textarea
              value={instruction}
              onChange={(e) => {
                const newInstructions = [...instructions];
                newInstructions[index] = e.target.value;
                setInstructions(newInstructions);
              }}
              placeholder={t('createRecipe.instructions.stepPlaceholder', { number: index + 1 })}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          {instructions.length > 1 && (
            <button
              type="button"
              onClick={() => removeInstruction(index)}
              className="p-2 text-red-500 hover:text-red-600"
            >
              <Minus className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
  
export default InstructionsSection;