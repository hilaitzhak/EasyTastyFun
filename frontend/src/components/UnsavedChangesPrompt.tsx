import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ConfirmModal from './ConfirmModal';

/**
 * Warns the user about unsaved changes when they try to leave the page.
 * Covers both in-app navigation (via the router blocker) and browser
 * close/refresh (via beforeunload). Render it inside a page with `when`
 * bound to whether the form has unsaved changes.
 */
function UnsavedChangesPrompt({ when }: { when: boolean }) {
  const { t } = useTranslation();

  // Block in-app navigation to a different path while there are unsaved changes.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && currentLocation.pathname !== nextLocation.pathname
  );

  // Warn on browser tab close / refresh (the router blocker can't see these).
  useEffect(() => {
    if (!when) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [when]);

  if (blocker.state !== 'blocked') return null;

  return (
    <ConfirmModal
      message={t('common.unsavedChanges')}
      confirmLabel={t('common.leave')}
      cancelLabel={t('common.stay')}
      danger
      onConfirm={() => blocker.proceed()}
      onCancel={() => blocker.reset()}
    />
  );
}

export default UnsavedChangesPrompt;
