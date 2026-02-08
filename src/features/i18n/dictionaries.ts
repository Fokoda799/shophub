import 'server-only';
import type { Locale } from '@config';
import { Dictionary } from '@/types/local';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  ar: () => import('@/locales/ar.json').then((module) => module.default),
  fr: () => import('@/locales/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale]?.() ?? dictionaries.en();
}
  
