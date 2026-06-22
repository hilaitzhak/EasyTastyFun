import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Computes how much to scale ingredient quantities when changing pan size,
// based on the ratio of pan areas.
function area(shape: 'round' | 'rect', a: number, b: number): number {
  if (!a || a <= 0) return 0;
  if (shape === 'round') return Math.PI * (a / 2) ** 2;
  return a * (b > 0 ? b : a);
}

function PanScaler({ onFactorChange }: { onFactorChange: (factor: number) => void }) {
  const { t } = useTranslation();
  const [shape, setShape] = useState<'round' | 'rect'>('round');
  const [from, setFrom] = useState('24');
  const [fromB, setFromB] = useState('24');
  const [to, setTo] = useState('28');
  const [toB, setToB] = useState('28');

  useEffect(() => {
    const origin = area(shape, parseFloat(from), parseFloat(fromB));
    const target = area(shape, parseFloat(to), parseFloat(toB));
    const factor = origin > 0 && target > 0 ? target / origin : 1;
    onFactorChange(factor);
  }, [shape, from, fromB, to, toB, onFactorChange]);

  const factor = (() => {
    const origin = area(shape, parseFloat(from), parseFloat(fromB));
    const target = area(shape, parseFloat(to), parseFloat(toB));
    return origin > 0 && target > 0 ? target / origin : 1;
  })();

  const numInput = 'w-14 px-2 py-1 rounded-lg border border-line bg-paper text-sm text-center';

  return (
    <div className="mt-3 p-3 bg-paper rounded-xl border border-line text-sm">
      <div className="flex gap-2 mb-3">
        {(['round', 'rect'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setShape(s)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              shape === s ? 'bg-terracotta text-white border-transparent' : 'bg-surface border-line text-ink-soft hover:border-terracotta'
            }`}
          >
            {t(`panScaler.${s}`)}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-ink-soft text-xs flex-1">{t('panScaler.from')}</span>
        <input type="number" value={from} onChange={(e) => setFrom(e.target.value)} className={numInput} />
        {shape === 'rect' && <><span className="text-ink-muted">×</span><input type="number" value={fromB} onChange={(e) => setFromB(e.target.value)} className={numInput} /></>}
        <span className="text-ink-muted text-xs">cm</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-ink-soft text-xs flex-1">{t('panScaler.to')}</span>
        <input type="number" value={to} onChange={(e) => setTo(e.target.value)} className={numInput} />
        {shape === 'rect' && <><span className="text-ink-muted">×</span><input type="number" value={toB} onChange={(e) => setToB(e.target.value)} className={numInput} /></>}
        <span className="text-ink-muted text-xs">cm</span>
      </div>

      <p className="text-xs text-terracotta-dark font-medium mt-3">{t('panScaler.factor', { factor: factor.toFixed(2) })}</p>
    </div>
  );
}

export default PanScaler;
