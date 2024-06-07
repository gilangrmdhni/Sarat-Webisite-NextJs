import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';
import { useAuth } from './context/authContext';
import Layout from '@/components/Layout';

const LoginPage = () => {
    const { user, login } = useAuth();
    const router = useRouter();
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            router.push('/HomePage');
        }
    }, [user]);

    const handleLogin = async ({ username, password }) => {
        try {
            await login({ username, password });
            setShowError(false);
            router.push('/HomePage');
        } catch (error) {
            console.error('Login error:', error.message);
            setError('Username atau password salah. Silakan coba lagi.');
            setShowError(true);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:text-black">
                {/* Logo Web Anda */}
                <img src="images/logo_SAIM.png" alt="Logo Web" className="w-50 h-50 mb-4" />
                {/* Sambutan */}
                <p className="text-xl text-center font-medium mb-1">Assalamualaikum </p>
                <p className="text-xl text-center font-medium mb-4">Silahkan Login Untuk Melanjutkan</p>
                {/* Form Login */}
                <LoginForm onLogin={handleLogin} showError={showError} error={error} />
            </div>
        </Layout>
    );
};

export default LoginPage;
