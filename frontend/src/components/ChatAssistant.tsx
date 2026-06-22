import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import { recipeApi } from '../api/recipe.api';

interface Msg { role: 'user' | 'assistant'; content: string; }

/** "Ask the chef" — a floating chat about a specific recipe. */
function ChatAssistant({ recipeId, recipeName }: { recipeId: string; recipeName: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const question = input.trim();
    if (!question || loading) return;
    const history = messages;
    setMessages((m) => [...m, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await recipeApi.ask(recipeId, question, i18n.language, history);
      setMessages((m) => [...m, { role: 'assistant', content: data.answer || '' }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: t('chat.error') }]);
    } finally {
      setLoading(false);
    }
  };

  if (!recipeId) return null;

  return (
    <div className="print:hidden">
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={t('chat.title')}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-terracotta hover:bg-terracotta-dark text-white shadow-card flex items-center justify-center transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[22rem] max-w-[calc(100vw-3rem)] h-[30rem] max-h-[calc(100vh-3rem)] bg-surface rounded-2xl shadow-xl border border-line flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-terracotta text-white">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              <span className="font-semibold text-sm">{t('chat.title')}</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t('common.cancel')} className="hover:opacity-80">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-sm text-ink-soft text-center mt-6">{t('chat.intro', { recipe: recipeName })}</p>
            )}
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug whitespace-pre-wrap ${
                  m.role === 'user' ? 'bg-terracotta text-white' : 'bg-paper border border-line text-ink-soft'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl bg-paper border border-line">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-terracotta border-t-transparent" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-line flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
              placeholder={t('chat.placeholder')}
              className="flex-1 px-3 py-2 rounded-xl border border-line focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent bg-paper text-sm"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-terracotta hover:bg-terracotta-dark text-white transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatAssistant;
