import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "../i18n.config";

function detectLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (!acceptLanguage) return i18n.defaultLocale;

  const preferred = acceptLanguage.split(",")[0]?.split("-")[0];
  if (preferred && i18n.locales.includes(preferred as any)) {
    return preferred;
  }
  return i18n.defaultLocale;
}

function pathnameHasLocale(pathname: string) {
  return i18n.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
}

function getLocaleFromPathname(pathname: string) {
  const found = i18n.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  return found ?? null;
}

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // ✅ Skip Next internals, API, and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // ✅ Admin protection must work for BOTH /admin and /{locale}/admin
  const localeInPath = getLocaleFromPathname(pathname);
  const adminPath =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    (localeInPath &&
      (pathname === `/${localeInPath}/admin` ||
        pathname.startsWith(`/${localeInPath}/admin/`)));

  if (adminPath) {
    const token = searchParams.get("token");
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken || token !== adminToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  // ✅ If already localized, continue
  if (pathnameHasLocale(pathname)) {
    return NextResponse.next();
  }

  // ✅ Otherwise redirect to detected locale
  const locale = detectLocale(req);
  const url = req.nextUrl.clone();

  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  // query params are kept automatically because we cloned nextUrl

  return NextResponse.redirect(url);
}

export const config = {
  // ✅ Match all routes except _next/static, _next/image, favicon, and API
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
