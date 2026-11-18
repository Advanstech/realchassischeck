import { getRequestConfig } from 'next-intl/server';

/**
 * Ghana launches in English only. The i18n plumbing exists from day one so adding
 * a language is a new messages file, not a refactor (SRS: multi-language readiness).
 */
export default getRequestConfig(async () => {
  const locale = 'en';
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
