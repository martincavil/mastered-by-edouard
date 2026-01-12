'use client';

import { useLanguage } from './LanguageProvider';
import { getTranslations } from './index';

export function useTranslations() {
  const { locale } = useLanguage();
  return getTranslations(locale);
}
