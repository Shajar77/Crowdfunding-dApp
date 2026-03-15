import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* SEO Meta */}
        <meta name="description" content="Fundverse — The next generation of decentralized crowdfunding. Launch campaigns, back ideas, and build the future on-chain." />
        <meta name="theme-color" content="#064e3b" />
        <meta name="color-scheme" content="light" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Fundverse — Decentralized Crowdfunding" />
        <meta property="og:description" content="Launch campaigns on Ethereum. Get backed by a global community — transparent, trustless, and borderless." />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://images.unsplash.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
