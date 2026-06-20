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
                    className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface hover:bg-terracotta-light border border-line text-sm font-medium text-ink-soft hover:text-ink transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {t('common.cancel')}
                </button>
            )}
            <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-terracotta hover:bg-terracotta-dark shadow hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] ${!loading ? 'hover:scale-[1.03]' : ''}`}
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