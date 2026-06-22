import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { userApi } from '../api/user.api';

interface NotesContextProps {
  ids: Set<string>;
  hasNote: (recipeId: string) => boolean;
  // Called after a note is saved/cleared so card badges stay in sync.
  markNote: (recipeId: string, has: boolean) => void;
}

export const NotesContext = createContext<NotesContextProps | null>(null);

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const auth = useContext(AuthContext);
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!auth?.token) {
      setIds(new Set());
      return;
    }
    userApi
      .getNoteIds(auth.token)
      .then(({ data }) => setIds(new Set(data)))
      .catch(() => { /* non-critical */ });
  }, [auth?.token]);

  const hasNote = (recipeId: string) => ids.has(recipeId);

  const markNote = (recipeId: string, has: boolean) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (has) next.add(recipeId);
      else next.delete(recipeId);
      return next;
    });
  };

  return (
    <NotesContext.Provider value={{ ids, hasNote, markNote }}>
      {children}
    </NotesContext.Provider>
  );
};
