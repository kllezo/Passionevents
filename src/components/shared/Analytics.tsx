import Script from "next/script";

/**
 * Google Analytics 4. Renders nothing unless NEXT_PUBLIC_GA_ID is set to a
 * GA4 measurement ID (G-XXXXXXXXXX), so no tracking runs until the client
 * chooses to turn it on. Loads after the page is interactive; GA4's enhanced
 * measurement records client-side navigations as page views.
 * NEXT_PUBLIC_ values are read at build time: set it, then rebuild.
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID?.trim();
  if (!id || !/^G-[A-Z0-9]{4,}$/.test(id)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
