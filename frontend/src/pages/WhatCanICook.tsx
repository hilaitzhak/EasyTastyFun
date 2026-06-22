import { useState } from 'react';
import { ChefHat, Sparkles, X, Plus, AlertCircle, Recycle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import { recipeApi } from '../api/recipe.api';
import RecipeCard from '../components/RecipeCard';

interface Match {
  recipe: any;
  missingIngredients: string[];
}

interface Idea {
  title: string;
  description: string;
}

function WhatCanICook() {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Match[] | null>(null);
  const [ideas, setIdeas] = useState<Idea[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [ideasLoading, setIdeasLoading] = useState(false);

  const addIngredient = () => {
    const value = input.trim();
    if (value && !ingredients.includes(value)) {
      setIngredients((prev) => [...prev, value]);
    }
    setInput('');
  };

  const removeIngredient = (value: string) => {
    setIngredients((prev) => prev.filter((i) => i !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addIngredient();
    }
  };

  const search = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setResults(null);
    setIdeas(null);
    try {
      const { data } = await recipeApi.whatCanICook(ingredients, i18n.language);
      setResults(data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getIdeas = async () => {
    if (ingredients.length === 0) return;
    setIdeasLoading(true);
    setIdeas(null);
    setResults(null);
    try {
      const { data } = await recipeApi.leftoverIdeas(ingredients, i18n.language);
      setIdeas(data.ideas || []);
    } catch {
      setIdeas([]);
    } finally {
      setIdeasLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-terracotta-light border-b border-line px-6 py-10">
        <div className="max-w-4xl mx-auto flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-terracotta flex items-center justify-center shadow-md flex-shrink-0">
            <ChefHat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">{t('whatCanICook.title')}</h1>
            <p className="text-ink-soft mt-1">{t('whatCanICook.subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Ingredient input */}
        <div className="bg-surface rounded-2xl border border-line shadow-card p-6">
          <label className="block text-sm font-medium text-ink-soft mb-3">{t('whatCanICook.inputLabel')}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('whatCanICook.inputPlaceholder')}
              className="flex-1 px-4 py-2.5 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent bg-paper"
            />
            <button
              type="button"
              onClick={addIngredient}
              className="px-4 py-2.5 rounded-xl border border-line text-ink-soft hover:border-terracotta hover:text-terracotta transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {ingredients.map((ing) => (
                <span key={ing} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-terracotta-light text-terracotta-dark text-sm font-medium">
                  {ing}
                  <button type="button" onClick={() => removeIngredient(ing)} className="hover:text-terracotta">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={search}
              disabled={ingredients.length === 0 || loading || ideasLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-terracotta hover:bg-terracotta-dark shadow-soft transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? t('whatCanICook.searching') : t('whatCanICook.search')}
            </button>
            <button
              type="button"
              onClick={getIdeas}
              disabled={ingredients.length === 0 || loading || ideasLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-terracotta-dark bg-terracotta-light border border-line hover:border-terracotta transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Recycle className="w-4 h-4" />
              {ideasLoading ? t('whatCanICook.thinking') : t('whatCanICook.getIdeas')}
            </button>
          </div>
        </div>

        {/* Results */}
        {(loading || ideasLoading) && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-terracotta border-t-transparent" />
          </div>
        )}

        {ideas && !ideasLoading && (
          ideas.length === 0 ? (
            <div className="text-center py-12 text-ink-soft">{t('whatCanICook.noResults')}</div>
          ) : (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-ink">{t('whatCanICook.ideasTitle')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ideas.map((idea, idx) => (
                  <div key={idx} className="bg-surface rounded-2xl border border-line shadow-card p-5">
                    <h3 className="font-display font-semibold text-ink mb-1">{idea.title}</h3>
                    <p className="text-sm text-ink-soft leading-relaxed">{idea.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {results && !loading && (
          results.length === 0 ? (
            <div className="text-center py-12 text-ink-soft">{t('whatCanICook.noResults')}</div>
          ) : (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold text-ink">{t('whatCanICook.resultsTitle', { count: results.length })}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map(({ recipe, missingIngredients }) => (
                  <div key={recipe.recipeId} className="flex flex-col">
                    <RecipeCard recipe={recipe} />
                    {missingIngredients.length > 0 && (
                      <div className="mt-2 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{t('whatCanICook.missing')}: {missingIngredients.join(', ')}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default WhatCanICook;
