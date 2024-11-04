import createMiddleware from 'next-intl/middleware';
import { localePrefix } from './navigation';

// We are not using localePrefix directly here to maintain more direct control over
// locale handling, manually specifying locales in route paths where needed.
const locales = ['en', 'es', 'ar', 'ko', 'en-GB', 'hau-NG', 'ewe-BJ'];
const defaultLocale = 'en';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/users`, optionally with a locale prefix
    '/([\\w-]+)?/users/(.+)',
  ],
};
