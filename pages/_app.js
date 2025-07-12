// Import global styles
import '@/styles/globals.css';
// Import Google Fonts using next/font
import { Epilogue } from 'next/font/google';
// Import components and context
import { NavBar, Footer, Menu, Logo, Hero ,PopUp, Card} from '../Components';
import { CrowdFundingProvider } from '../Context/CrowdFunding';

// Define the font using next/font
const epilogue = Epilogue({
  subsets: ['latin'],
  weights: ['400', '500', '600', '700'], // Add the weights you need
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Apply the font globally using the font class */}
      <div className={epilogue.className}>
        <CrowdFundingProvider>
          <NavBar />
          <Menu />
          <Card/>
          <PopUp/>
          <Component {...pageProps} />
          <Footer />
        </CrowdFundingProvider>
      </div>
    </>
  );
}

export default MyApp;
