import { useTranslation } from "react-i18next";
import { BasicInfoSectionProps } from "../interfaces/Recipe";

function BasicInfoSection({ initialData, categories, subcategories, onCategoryChange, onSubCategoryChange, selectedCategory, selectedSubCategory }: BasicInfoSectionProps) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100/50 p-8 transition-all hover:shadow-2xl">
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
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            placeholder={t('createRecipe.basicInfo.name.placeholder')}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'prepTime', label: t('recipe.prepTime'), value: initialData?.prepTime },
            { name: 'cookTime', label: t('recipe.cookTime'), value: initialData?.cookTime },
            { name: 'servings', label: t('recipe.servings'), value: initialData?.servings }
          ].map(({ name, label, value }) => (
            <div key={name} className="space-y-2">
              <label className="block text-xs font-medium text-gray-600">
                {label}
              </label>
              <input
                type="number"
                name={name}
                defaultValue={value}
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
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
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
          >
            <option value="">{t('createRecipe.basicInfo.category.placeholder')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {t(`${category.nameKey}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Only show subcategory dropdown if there are subcategories available */}
        {subcategories && subcategories.length > 0 && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              {t('createRecipe.basicInfo.subcategory.label')}
            </label>
            <select
              name="subcategory"
              value={selectedSubCategory || ''}
              onChange={(e) => onSubCategoryChange(e.target.value)}
              disabled={!selectedCategory}
              className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 disabled:bg-gray-100"
            >
              <option value="">{t('createRecipe.basicInfo.subcategory.placeholder')}</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {t(`${subcategory.nameKey}`)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
  
export default BasicInfoSection;