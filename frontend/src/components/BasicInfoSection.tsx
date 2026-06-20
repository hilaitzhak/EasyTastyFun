import { useTranslation } from "react-i18next";
import { BasicInfoSectionProps } from "../interfaces/Recipe";

function BasicInfoSection({ initialData, categories, subcategories, onCategoryChange, onSubCategoryChange, selectedCategory, selectedSubCategory }: BasicInfoSectionProps) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-surface rounded-2xl shadow-card border border-line p-8 transition-all hover:shadow-soft">
      <div className="space-y-4">

        <div>
          <label className="block text-ink font-medium mb-2">
            {t('createRecipe.basicInfo.name.label')}
          </label>
          <input
            type="text"
            name="name"
            defaultValue={initialData?.name}
            required
            className="w-full px-4 py-2 rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta"
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
              <label className="block text-xs font-medium text-ink-soft">
                {label}
              </label>
              <input
                type="number"
                name={name}
                defaultValue={value}
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-line focus:border-terracotta focus:outline-none transition-colors"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-ink font-medium mb-2">
            {t('createRecipe.basicInfo.category.label')}
          </label>
          <select
            name="category"
            value={selectedCategory || ''}
            onChange={(e) => onCategoryChange(e.target.value)}
            required
            className="px-4 py-2 rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta"
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
            <label className="block text-ink font-medium mb-2">
              {t('createRecipe.basicInfo.subcategory.label')}
            </label>
            <select
              name="subcategory"
              value={selectedSubCategory || ''}
              onChange={(e) => onSubCategoryChange(e.target.value)}
              disabled={!selectedCategory}
              className="px-4 py-2 rounded-lg border border-line focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta disabled:bg-gray-100"
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