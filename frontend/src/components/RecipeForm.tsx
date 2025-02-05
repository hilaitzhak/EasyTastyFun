import { RecipeFormProps } from '../interfaces/Recipe';
import BasicInfoSection from './BasicInfoSection';
import ImageUploadSection from './ImageUploadSection';
import IngredientsSection from './IngredientsSection';
import InstructionsSection from './InstructionsSection';
import SubmitButton from './SubmitButton';
import TipsSection from './TipsSection';
import VideoUploadSection from './VideoUploadSection';

function RecipeForm({ onSubmit, loading, isEdit = false, initialData, ingredientGroups, setIngredientGroups,instructionGroups,
    setInstructionGroups,images,setImages,onCancel,categories,subcategories,onCategoryChange,onSubCategoryChange, selectedCategory, selectedSubCategory, tips = [],
    setTips, video = null, setVideo, }: RecipeFormProps) {

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <BasicInfoSection initialData={initialData} categories={categories} subcategories={subcategories} onCategoryChange={onCategoryChange} onSubCategoryChange={onSubCategoryChange} selectedCategory={selectedCategory} selectedSubCategory={selectedSubCategory} />
            
            <ImageUploadSection
            images={images}
            setImages={setImages}
            />

            <VideoUploadSection
                video={video}
                setVideo={setVideo}
            />

            <IngredientsSection
            ingredientGroups={ingredientGroups}
            setIngredientGroups={setIngredientGroups}
            />

            <InstructionsSection
            instructionGroups={instructionGroups}
            setInstructionGroups={setInstructionGroups}
            />

            <TipsSection
                tips={tips}
                setTips={setTips}
            />

            <SubmitButton onCancel={onCancel} loading={loading} isEdit={isEdit}/>
        </form>
    );
}

export default RecipeForm;