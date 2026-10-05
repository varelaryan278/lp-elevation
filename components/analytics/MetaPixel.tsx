"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { marca } from "@/content/marca";
import { META_PIXEL_ID, flushPixelEvents, trackMetaEvent } from "@/lib/meta-pixel";
import { isPublicPath } from "@/lib/meta-events";

export const MetaPixel = () => {
  const pathname = usePathname();
  const lastPageView = useRef<string | null>(null);

  const trackPageView = useCallback(() => {
    if (!isPublicPath(pathname)) {
      lastPageView.current = null;
      return;
    }
    if (lastPageView.current === pathname) return;
    trackMetaEvent("PageView");
    lastPageView.current = pathname;
  }, [pathname]);

  useEffect(trackPageView, [trackPageView]);

  useEffect(() => {
    const trackLink = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a");
      if (!link) return;

      if (link.href === marca.grupoWhatsapp) {
        trackMetaEvent("GroupLead");
      }
    };

    document.addEventListener("click", trackLink, true);
    return () => document.removeEventListener("click", trackLink, true);
  }, []);

  if (!isPublicPath(pathname)) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive" onReady={flushPixelEvents}>
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');`}
      </Script>
      <noscript>
        {/* The tracking endpoint must use a native image without optimization. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          alt=""
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
};
