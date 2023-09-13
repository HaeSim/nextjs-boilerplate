import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import type { BeforeInstallPromptEvent } from '@/types/common/service';

interface A2HSReturn {
  deferredPrompt: BeforeInstallPromptEvent | null;
  installApp: () => void;
  clearPrompt: () => void;
}

const useA2HS = (): A2HSReturn => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as unknown as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const clearPrompt = (): void => {
    setDeferredPrompt(null);
  };

  const installApp = (): void => {
    deferredPrompt?.prompt();
    deferredPrompt?.userChoice.then((choiceResult) => {
      // eslint-disable-next-line no-console
      enqueueSnackbar(`install ${choiceResult.outcome}`, {
        variant: 'success',
      });
      clearPrompt();
    });
  };

  return { deferredPrompt, installApp, clearPrompt };
};

export default useA2HS;
