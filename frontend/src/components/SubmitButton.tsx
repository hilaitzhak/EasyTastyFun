import { Loader } from "lucide-react";
import { SubmitButtonProps } from "../interfaces/Recipe";
import { useTranslation } from "react-i18next";

function SubmitButton({ onCancel, loading, isEdit }: SubmitButtonProps) {
    const { t } = useTranslation();

    return (
        <div className="flex justify-end gap-4">
            {onCancel && (
                <button
                type="button"
                onClick={onCancel}
                className="px-8 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                {t('common.cancel')}
                </button>
            )}
            <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {loading ? (
                <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {isEdit ? t('editRecipe.savingChanges') : t('createRecipe.submit.creating')}
                </>
                ) : (
                isEdit ? t('editRecipe.saveChanges') : t('createRecipe.submit.create')
                )}
            </button>
        </div>
    );
};

export default SubmitButton;