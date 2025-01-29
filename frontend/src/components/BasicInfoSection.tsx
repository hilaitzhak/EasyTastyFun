import { useTranslation } from "react-i18next";
import { BasicInfoSectionProps } from "../interfaces/Recipe";

function BasicInfoSection({ initialData, categories, subcategories, onCategoryChange, selectedCategory }: BasicInfoSectionProps) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100/50 p-8 transition-all hover:shadow-xl">
      <div className="space-y-4">

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

        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'prepTime', label: t('recipe.prepTime') },
            { name: 'cookTime', label: t('recipe.cookTime') },
            { name: 'servings', label: t('recipe.servings') }
          ].map(({ name, label }) => (
            <div key={name} className="space-y-2">
              <label className="block text-xs font-medium text-gray-600">
                {label}
              </label>
              <input
                type="number"
                name={name}
                defaultValue={initialData?.name}
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-purple-300 focus:outline-none transition-colors"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {t('createRecipe.basicInfo.category.label')}
          </label>
          <select
            name="category"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">{t('createRecipe.basicInfo.category.placeholder')}</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {t(`${category.nameKey}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            {t('createRecipe.basicInfo.subcategory.label')}
          </label>
          <select
            name="subcategory"
            disabled={!selectedCategory}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">{t('createRecipe.basicInfo.subcategory.placeholder')}</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {t(`${subcategory.nameKey}`)}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {initialData?.prepTime && initialData?.prepTime > 0 && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {t('createRecipe.basicInfo.prepTime.label')}
              </label>
              <input
                type="number"
                name="prepTime"
                defaultValue={initialData?.prepTime}
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
          {initialData?.cookTime && initialData?.cookTime > 0 && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {t('createRecipe.basicInfo.cookTime.label')}
              </label>
              <input
                type="number"
                name="cookTime"
                defaultValue={initialData?.cookTime}
                min="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )} 
          {initialData?.servings && initialData?.servings > 0 && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {t('createRecipe.basicInfo.servings.label')}
              </label>
              <input
                type="number"
                name="servings"
                defaultValue={initialData?.servings}
                min="1"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
};
  
export default BasicInfoSection;