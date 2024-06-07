import { useEffect } from 'react';
import { AuthProvider } from './context/authContext';
import { PresensiProvider } from './context/PresensiContext';
import { PreTestProvider } from './context/PreTestContext';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <AuthProvider>
      <PresensiProvider>
        <PreTestProvider>
          <Component {...pageProps} />
        </PreTestProvider>
      </PresensiProvider>
    </AuthProvider>
  );
}

export default MyApp;
