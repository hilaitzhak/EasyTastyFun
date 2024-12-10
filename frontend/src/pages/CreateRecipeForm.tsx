// const CreateRecipeForm = () => {
//     const { t } = useTranslation();
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);
//     const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }]);
//     const [instructions, setInstructions] = useState(['']);
//     const [images, setImages] = useState<{ data: string; file: File }[]>([]);

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { recipeApi } from "../api/recipe.api";
import RecipeForm from "../components/RecipeForm";

//     const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//         const files = event.target.files;
//         if (!files) return;

//         Array.from(files).forEach(file => {
//         if (file.size > 5 * 1024 * 1024) {
//           alert(t('createRecipe.imageSizeError'));
//           return;
//         }

//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setImages(prev => [...prev, {
//             data: reader.result as string,
//             file
//             }]);
//         };
//         reader.readAsDataURL(file);
//         });
//     };

//   const removeImage = (index: number) => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   const addIngredient = () => {
//     setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
//   };

//   const removeIngredient = (index: number) => {
//     setIngredients(ingredients.filter((_, i) => i !== index));
//   };

//   const addInstruction = () => {
//     setInstructions([...instructions, '']);
//   };

//   const removeInstruction = (index: number) => {
//     setInstructions(instructions.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData(e.currentTarget);
//       const recipeData = {
//         name: formData.get('name'),
//         description: formData.get('description'),
//         prepTime: Number(formData.get('prepTime')),
//         cookTime: Number(formData.get('cookTime')),
//         servings: Number(formData.get('servings')),
//         ingredients: ingredients.filter(ing => ing.name && ing.amount && ing.unit),
//         instructions: instructions.filter(Boolean),
//         images: images.map(img => ({
//           data: img.data,
//           description: ''
//         }))
//       };

//       const response = await recipeApi.createRecipe(recipeData);

//       if (response.data) {
//         navigate(`/recipe/${response.data._id}`);
//       }
//     } catch (error: any) {
//       if (error.response) {
//         alert(t('createRecipe.errors.serverError', { 
//           message: error.response.data.message || error.response.statusText 
//         }));
//       } else if (error.request) {
//         alert(t('createRecipe.errors.connectionError'));
//       } else {
//         alert(t('createRecipe.errors.createError', { message: error.message }));
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-12">
//       <div className="container mx-auto px-4">
//         <div className="max-w-3xl mx-auto">
//           <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('createRecipe.title')}</h1>

//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Basic Info Section */}
//             <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
//               <div>
//                 <label className="block text-gray-700 font-medium mb-2">{t('createRecipe.basicInfo.name.label')}</label>
//                 <input
//                   type="text"
//                   name="name"
//                   required
//                   className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder={t('createRecipe.basicInfo.name.placeholder')}
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-2">{t('createRecipe.basicInfo.description.label')}</label>
//                 <textarea
//                   name="description"
//                   required
//                   rows={3}
//                   className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   placeholder={t('createRecipe.basicInfo.description.placeholder')}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">{t('createRecipe.basicInfo.prepTime.label')}</label>
//                   <input
//                     type="number"
//                     name="prepTime"
//                     required
//                     min="0"
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">{t('createRecipe.basicInfo.cookTime.label')}</label>
//                   <input
//                     type="number"
//                     name="cookTime"
//                     required
//                     min="0"
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">{t('createRecipe.basicInfo.servings.label')}</label>
//                   <input
//                     type="number"
//                     name="servings"
//                     required
//                     min="1"
//                     className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Images Section */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-4">{t('createRecipe.images.title')}</h2>
              
//               <div className="space-y-4">
//                 <label className="block text-gray-700 font-medium mb-2">{t('createRecipe.images.upload')}</label>
//                 <div className="flex items-center justify-center w-full">
//                   <label className="w-full flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-purple-500">
//                     <Upload className="w-8 h-8 text-gray-400" />
//                     <span className="mt-2 text-gray-500">{t('createRecipe.images.dragDrop')}</span>
//                     <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
//                   </label>
//                 </div>

//                 {images.length > 0 && (
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
//                     {images.map((image, index) => (
//                       <div key={index} className="relative rounded-lg overflow-hidden">
//                         <img
//                           src={image.data}
//                           alt={`Preview ${index + 1}`}
//                           className="w-full h-32 object-cover"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(index)}
//                           className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                         >
//                           <Minus className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Ingredients Section */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-semibold text-gray-800">{t('createRecipe.ingredients.title')}</h2>
//                 <button
//                   type="button"
//                   onClick={addIngredient}
//                   className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
//                 >
//                   <Plus className="w-4 h-4" />
//                   {t('createRecipe.ingredients.add')}
//                 </button>
//               </div>

//               {ingredients.map((ingredient, index) => (
//                 <div key={index} className="flex gap-4 items-start mb-4">
//                   <div className="flex-1">
//                     <input
//                       type="text"
//                       value={ingredient.name}
//                       onChange={(e) => {
//                         const newIngredients = [...ingredients];
//                         newIngredients[index].name = e.target.value;
//                         setIngredients(newIngredients);
//                       }}
//                       placeholder={t('createRecipe.ingredients.namePlaceholder')}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     />
//                   </div>
//                   <div className="w-24">
//                     <input
//                       type="text"
//                       value={ingredient.amount}
//                       onChange={(e) => {
//                         const newIngredients = [...ingredients];
//                         newIngredients[index].amount = e.target.value;
//                         setIngredients(newIngredients);
//                       }}
//                       placeholder={t('createRecipe.ingredients.amountPlaceholder')}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     />
//                   </div>
//                   <div className="w-24">
//                     <input
//                       type="text"
//                       value={ingredient.unit}
//                       onChange={(e) => {
//                         const newIngredients = [...ingredients];
//                         newIngredients[index].unit = e.target.value;
//                         setIngredients(newIngredients);
//                       }}
//                       placeholder={t('createRecipe.ingredients.unitPlaceholder')}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     />
//                   </div>
//                   {ingredients.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeIngredient(index)}
//                       className="p-2 text-red-500 hover:text-red-600"
//                     >
//                       <Minus className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Instructions Section */}
//             <div className="bg-white rounded-xl shadow-md p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-semibold text-gray-800">Instructions</h2>
//                 <button
//                   type="button"
//                   onClick={addInstruction}
//                   className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
//                 >
//                   <Plus className="w-4 h-4" />
//                   {t('createRecipe.instructions.addStep')}
//                 </button>
//               </div>

//               {instructions.map((instruction, index) => (
//                 <div key={index} className="flex gap-4 items-start mb-4">
//                   <span className="mt-3 text-gray-500 font-medium">{index + 1}.</span>
//                   <div className="flex-1">
//                     <textarea
//                       value={instruction}
//                       onChange={(e) => {
//                         const newInstructions = [...instructions];
//                         newInstructions[index] = e.target.value;
//                         setInstructions(newInstructions);
//                       }}
//                       placeholder={t('createRecipe.instructions.stepPlaceholder', { number: index + 1 })}
//                       rows={2}
//                       className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                     />
//                   </div>
//                   {instructions.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeInstruction(index)}
//                       className="p-2 text-red-500 hover:text-red-600"
//                     >
//                       <Minus className="w-4 h-4" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 {loading ? (
//                     <>
//                       <Loader className="w-5 h-5 animate-spin" />
//                       {t('createRecipe.submit.creating')}
//                     </>
//                 ) : (
//                     t('createRecipe.submit.create')
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

const CreateRecipeForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }]);
  const [instructions, setInstructions] = useState(['']);
  const [images, setImages] = useState<{ data: string; file: File }[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const recipeData = {
        name: formData.get('name'),
        description: formData.get('description'),
        prepTime: Number(formData.get('prepTime')),
        cookTime: Number(formData.get('cookTime')),
        servings: Number(formData.get('servings')),
        ingredients: ingredients.filter(ing => ing.name && ing.amount && ing.unit),
        instructions: instructions.filter(Boolean),
        images: images.map(img => ({
          data: img.data,
          description: ''
        }))
      };

      const response = await recipeApi.createRecipe(recipeData);

      if (response.data) {
        navigate(`/recipe/${response.data._id}`);
      }
    } catch (error: any) {
      if (error.response) {
        alert(t('createRecipe.errors.serverError', { 
          message: error.response.data.message || error.response.statusText 
        }));
      } else if (error.request) {
        alert(t('createRecipe.errors.connectionError'));
      } else {
        alert(t('createRecipe.errors.createError', { message: error.message }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">{t('createRecipe.title')}</h1>
          <RecipeForm
            onSubmit={handleSubmit}
            loading={loading}
            ingredients={ingredients}
            setIngredients={setIngredients}
            instructions={instructions}
            setInstructions={setInstructions}
            images={images}
            setImages={setImages}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateRecipeForm;