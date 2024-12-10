import { useTranslation } from "react-i18next";
import { BasicInfoSectionProps } from "../interfaces/Recipe";

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ initialData }) => {
    const { t } = useTranslation();
  
    return (
      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {t('createRecipe.basicInfo.name.label')}
          </label>
          <input
            type="text"
            name="name"
            defaultValue={initialData?.name}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={t('createRecipe.basicInfo.name.placeholder')}
          />
        </div>
  
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {t('createRecipe.basicInfo.description.label')}
          </label>
          <textarea
            name="description"
            defaultValue={initialData?.description}
            required
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={t('createRecipe.basicInfo.description.placeholder')}
          />
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {t('createRecipe.basicInfo.prepTime.label')}
            </label>
            <input
              type="number"
              name="prepTime"
              defaultValue={initialData?.prepTime}
              required
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {t('createRecipe.basicInfo.cookTime.label')}
            </label>
            <input
              type="number"
              name="cookTime"
              defaultValue={initialData?.cookTime}
              required
              min="0"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {t('createRecipe.basicInfo.servings.label')}
            </label>
            <input
              type="number"
              name="servings"
              defaultValue={initialData?.servings}
              required
              min="1"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    );
  };
  
export default BasicInfoSection;