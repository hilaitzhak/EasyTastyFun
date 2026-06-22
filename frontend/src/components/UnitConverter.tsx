import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Volume units expressed in millilitres, weight units in grams.
const VOLUME: Record<string, number> = { ml: 1, l: 1000, tsp: 4.929, tbsp: 14.787, cup: 236.588, 'fl oz': 29.574 };
const WEIGHT: Record<string, number> = { g: 1, kg: 1000, oz: 28.35, lb: 453.592 };
const UNITS = [...Object.keys(VOLUME), ...Object.keys(WEIGHT)];
const isVolume = (u: string) => u in VOLUME;

// Approximate densities in grams per millilitre, so we can cross between
// volume and weight (e.g. 100 ml oil ≈ 92 g, 100 ml flour ≈ 53 g).
const INGREDIENTS: Record<string, number> = {
  water: 1.0,
  milk: 1.03,
  oil: 0.92,
  butter: 0.911,
  flour: 0.53,
  sugar: 0.85,
  brownSugar: 0.72,
  powderedSugar: 0.56,
  honey: 1.42,
  salt: 1.22,
  cocoa: 0.52,
  rice: 0.85,
};

function UnitConverter({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [ingredient, setIngredient] = useState('water');
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('ml');
  const [to, setTo] = useState('g');

  const density = INGREDIENTS[ingredient] || 1;
  // Only need the ingredient when crossing between volume and weight.
  const crossesDimension = isVolume(from) !== isVolume(to);

  const toGrams = (value: number, unit: string) =>
    isVolume(unit) ? value * VOLUME[unit] * density : value * WEIGHT[unit];
  const fromGrams = (grams: number, unit: string) =>
    isVolume(unit) ? grams / density / VOLUME[unit] : grams / WEIGHT[unit];

  const num = parseFloat(amount);
  const result = isNaN(num) ? '' : fromGrams(toGrams(num, from), to).toFixed(2).replace(/\.?0+$/, '');

  const unitOption = (u: string) => <option key={u} value={u}>{u}</option>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-ink">{t('converter.title')}</h3>
          <button onClick={onClose} data-tooltip={t('common.close')} aria-label={t('common.close')} className="text-ink-muted hover:text-ink p-1"><X className="w-5 h-5" /></button>
        </div>

        {/* Ingredient — needed to convert between volume and weight */}
        <label className="block text-xs font-medium text-ink-soft mb-1">{t('converter.ingredient')}</label>
        <select
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-terracotta"
        >
          {Object.keys(INGREDIENTS).map((key) => (
            <option key={key} value={key}>{t(`converter.ingredients.${key}`)}</option>
          ))}
        </select>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-terracotta"
            />
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-sm">
              {UNITS.map(unitOption)}
            </select>
          </div>
          <ArrowRight className="w-5 h-5 text-ink-muted mb-3 flex-shrink-0" />
          <div className="flex-1">
            <div className="w-full px-3 py-2 rounded-xl border border-line bg-terracotta-light text-sm mb-2 font-semibold text-terracotta-dark min-h-[2.4rem] flex items-center">
              {result}
            </div>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-line bg-paper text-sm">
              {UNITS.map(unitOption)}
            </select>
          </div>
        </div>

        <p className="text-xs text-ink-muted mt-4">
          {crossesDimension ? t('converter.densityNote', { ingredient: t(`converter.ingredients.${ingredient}`) }) : t('converter.note')}
        </p>
      </div>
    </div>
  );
}

export default UnitConverter;
