import { AuthProvider } from './context/authContext';
import { PresensiProvider } from './context/PresensiContext';
import { PreTestProvider } from './context/PreTestContext';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
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
