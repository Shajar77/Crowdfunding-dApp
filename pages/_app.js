import '@/styles/globals.css';
import '@/styles/navbar.css';
import '@/styles/section-head.css';
import '@/styles/page-grid.css';
import { Inter } from 'next/font/google';
import { Footer } from '../Components';
import { CrowdFundingProvider } from '../Context/CrowdFunding';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Optimized font loading via next/font (no layout shift, self-hosted)
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

import { Bricolage_Grotesque } from 'next/font/google';
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
  variable: '--font-bricolage',
});

// Lazy load Footer to reduce initial bundle
const LazyNavBar = dynamic(() => import('../Components').then(mod => ({ default: mod.NavBar })), {
  ssr: false,
});

const LazyFooter = dynamic(() => import('../Components').then(mod => ({ default: mod.Footer })), {
  ssr: false,
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Fundverse — Decentralized Crowdfunding</title>
      </Head>
      <div className={`${inter.variable} ${inter.className} ${bricolage.variable}`}>
        <CrowdFundingProvider>
          <LazyNavBar />
          <Component {...pageProps} />
          <LazyFooter />
        </CrowdFundingProvider>
        {/* Toast notifications — themed to match emerald design */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255,255,255,0.98)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '14px',
              boxShadow: '0 8px 32px rgba(6,78,59,0.1), 0 2px 8px rgba(0,0,0,0.05)',
              color: '#064e3b',
              fontSize: '14px',
              fontWeight: '500',
              fontFamily: "'Inter', sans-serif",
              padding: '14px 18px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#fff' },
            },
          }}
        />
      </div>
    </>
  );
}

export default MyApp;
