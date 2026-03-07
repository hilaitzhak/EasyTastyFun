import { useTranslation } from "react-i18next";
import { BasicInfoSectionProps } from "../interfaces/Recipe";
import { BookOpen } from "lucide-react";

function BasicInfoSection({ initialData, categories, subcategories, onCategoryChange, onSubCategoryChange, selectedCategory, selectedSubCategory }: BasicInfoSectionProps) {
  const { t } = useTranslation();

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-colors bg-white text-gray-800 placeholder-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-primary-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{t('createRecipe.basicInfo.name.label')}</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className={labelClass}>{t('createRecipe.basicInfo.name.label')}</label>
          <input
            type="text"
            name="name"
            defaultValue={initialData?.name}
            required
            className={inputClass}
            placeholder={t('createRecipe.basicInfo.name.placeholder')}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'prepTime', label: t('recipe.prepTime'), value: initialData?.prepTime, unit: 'min' },
            { name: 'cookTime', label: t('recipe.cookTime'), value: initialData?.cookTime, unit: 'min' },
            { name: 'servings', label: t('recipe.servings'), value: initialData?.servings, unit: '' }
          ].map(({ name, label, value, unit }) => (
            <div key={name}>
              <label className={labelClass}>{label}</label>
              <div className="relative">
                <input
                  type="number"
                  name={name}
                  defaultValue={value}
                  min="0"
                  className={`${inputClass} ${unit ? 'pr-12' : ''}`}
                />
                {unit && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                    {unit}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className={labelClass}>{t('createRecipe.basicInfo.category.label')}</label>
          <select
            name="category"
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value)}
            required
            className={inputClass}
          >
            <option value="">{t('createRecipe.basicInfo.category.placeholder')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {t(`${category.nameKey}`)}
              </option>
            ))}
          </select>
        </div>

        {subcategories && subcategories.length > 0 && (
          <div>
            <label className={labelClass}>{t('createRecipe.basicInfo.subcategory.label')}</label>
            <select
              name="subcategory"
              value={selectedSubCategory || ''}
              onChange={(e) => onSubCategoryChange(e.target.value)}
              disabled={!selectedCategory}
              className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed`}
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