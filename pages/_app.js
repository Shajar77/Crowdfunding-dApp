// Import global styles
import '@/styles/globals.css';
// Import Google Fonts using next/font
import { Epilogue } from 'next/font/google';
// Import components and context
import { NavBar, Footer } from '../Components';
import { CrowdFundingProvider } from '../Context/CrowdFunding';

import Head from 'next/head';

// Define the font using next/font
const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <title>Crowdfunding dApp</title>
      </Head>
      <div className={epilogue.className}>
        <CrowdFundingProvider>
          <NavBar />
          <Component {...pageProps} />
          <Footer />
        </CrowdFundingProvider>
      </div>
    </>
  );
}

export default MyApp;
