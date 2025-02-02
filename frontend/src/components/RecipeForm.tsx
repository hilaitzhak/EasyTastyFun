import { RecipeFormProps } from '../interfaces/Recipe';
import BasicInfoSection from './BasicInfoSection';
import ImageUploadSection from './ImageUploadSection';
import IngredientsSection from './IngredientsSection';
import InstructionsSection from './InstructionsSection';
import SubmitButton from './SubmitButton';

function RecipeForm({ onSubmit, loading, isEdit = false, initialData, ingredientGroups, setIngredientGroups,instructionGroups,
    setInstructionGroups,images,setImages,onCancel,categories,subcategories,onCategoryChange,onSubCategoryChange, selectedCategory, selectedSubCategory }: RecipeFormProps) {

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <BasicInfoSection initialData={initialData} categories={categories} subcategories={subcategories} onCategoryChange={onCategoryChange} onSubCategoryChange={onSubCategoryChange} selectedCategory={selectedCategory} selectedSubCategory={selectedSubCategory} />
            
            <ImageUploadSection
            images={images}
            setImages={setImages}
            />

            <IngredientsSection
            ingredientGroups={ingredientGroups}
            setIngredientGroups={setIngredientGroups}
            />

            <InstructionsSection
            instructionGroups={instructionGroups}
            setInstructionGroups={setInstructionGroups}
            />

            <SubmitButton onCancel={onCancel} loading={false} isEdit={isEdit}/>
        </form>
    );
}

export default RecipeForm;