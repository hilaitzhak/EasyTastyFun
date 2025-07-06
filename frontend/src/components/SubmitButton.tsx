
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
                    className="group flex items-center border-orange-300 gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-sm text-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {t('common.cancel')}
                </button>
            )}
            <button
                type="submit"
                disabled={loading}
                className={`bg-gradient-to-r from-orange-500 to-pink-500 
                text-white px-4 py-2 rounded-xl 
                hover:from-orange-600 hover:to-pink-600 
                transition-transform shadow 
                disabled:opacity-50 disabled:cursor-not-allowed 
                flex items-center justify-center gap-2 min-w-[130px] text-sm
                ${!loading ? 'hover:scale-[1.03]' : ''}`}
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