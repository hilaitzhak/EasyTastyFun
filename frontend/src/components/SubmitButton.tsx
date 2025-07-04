
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
                disabled={loading}
                className="px-8 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {t('common.cancel')}
                </button>
            )}
            <button
                type="submit"
                disabled={loading}
                className={`
                    bg-gradient-to-r from-orange-500 to-pink-500 
                    text-white px-8 py-3 rounded-full 
                    hover:from-orange-600 hover:to-pink-600 
                    transition-all transform 
                    shadow-lg 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
                    flex items-center justify-center gap-2 min-w-[160px]
                    ${!loading && 'hover:scale-105'}
                `}
            >
                {loading ? (
                <>
                    <Loader className="w-5 h-5 animate-spin" />
                </>
                ) : (
                isEdit ? t('editRecipe.saveChanges') : t('createRecipe.submit.create')
                )}
            </button>
        </div>
    );
};

export default SubmitButton;