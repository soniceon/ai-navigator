import React from 'react';
import { useTranslation } from 'next-i18next';

export function withTranslationReady<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithTranslationReady(props: P) {
    const { t, ready } = useTranslation();

    if (!ready) {
      return <div>{t('auto_loading_translations_a20f34')}</div>;
    }

    return <WrappedComponent {...props} />;
  };
} 