"use client";

import { Head } from "nextra/components";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";

export default function ConditionalHead() {
  const pathname = usePathname();



  // Check if we're on a docs page (path starts with /docs)
  const isDocsPage =
    pathname?.startsWith("/docs") || pathname?.startsWith("/api");

  return (
    <Head
      color={
        isDocsPage
          ? {
              hue: 265, // Violet hue
              saturation: 90, // Slightly reduced saturation
              lightness: {
                light: 45, // Slightly darker for light mode
                dark: 60, // Slightly lighter for dark mode
              },
            }
          : undefined
      }
    >
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>


<link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100..900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      />
      
      <Script
        defer
        data-domain="confident-ai.com"
        src="https://plausible.io/js/script.js"
      ></Script>
      <Script id="gtm-init" strategy="afterInteractive">
        {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PJ6SMMP5');
          `}
      </Script>
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-PJ6SMMP5"
          height="0"
          width="0"
        ></iframe>
      </noscript>
      {/* Don't set title or description here as they're handled by Nextra via useNextSeoProps */}
    </Head>
  );
}
