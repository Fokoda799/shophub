export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'ar', 'fr'],
  dir: (locale: string) => (locale === 'ar' ? 'rtl' : 'ltr'),
} as const;

export type Locale = (typeof i18n)['locales'][number];