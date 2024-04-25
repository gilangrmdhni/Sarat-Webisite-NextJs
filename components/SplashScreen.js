import React from 'react';
import Layout from '../components/Layout';

const SplashScreen = () => {
    return (
        <Layout>
            <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: '#F16877' }}>
                <img src="images/logo_SAIM.png" alt="Logo" className="w-40 h-40" />
            </div>
        </Layout>
    );
};

export default SplashScreen;
