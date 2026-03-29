import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";

  // Detect locale from browser's Accept-Language header
  const locale = acceptLanguage.toLowerCase().startsWith("no") ||
    acceptLanguage.toLowerCase().startsWith("nb") ||
    acceptLanguage.toLowerCase().startsWith("nn")
    ? "no"
    : "en";

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
