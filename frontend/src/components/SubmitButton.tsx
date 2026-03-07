import { Loader } from "lucide-react";
import { SubmitButtonProps } from "../interfaces/Recipe";
import { useTranslation } from "react-i18next";

function SubmitButton({ onCancel, loading, isEdit }: SubmitButtonProps) {
    const { t } = useTranslation();

    return (
        <div className="flex justify-end gap-3 pt-2">
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t('common.cancel')}
                </button>
            )}
            <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 shadow-md hover:shadow-lg hover:from-primary-600 hover:to-accent-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
            >
                {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                ) : (
                    isEdit ? t('editRecipe.saveChanges') : t('createRecipe.submit.create')
                )}
            </button>
        </div>
    );
};

export default SubmitButton;