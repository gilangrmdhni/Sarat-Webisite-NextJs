// pages/Login.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';
import { useAuth } from './context/authContext';
import Layout from '@/components/Layout';

const LoginPage = () => {
    const { user, login } = useAuth();
    const router = useRouter();
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        // Jika pengguna telah login, arahkan ke halaman beranda
        if (user) {
            router.push('/HomePage');
        }
    }, [user]); // Pastikan untuk menyertakan user sebagai dependensi

    const handleLogin = async ({ username, password }) => {
        try {
            await login({ username, password });
        } catch (error) {
            console.error('Login error:', error.message);
            setError('Username atau password salah. Silakan coba lagi.');
            setShowError(true);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                {/* Logo Web Anda */}
                <img src="images/logo_SAIM.png" alt="Logo Web" className="w-50 h-50 mb-4" />

                {/* Sambutan */}
                <p className="text-xl text-center font-medium mb-1">Assalamualaikum </p>
                <p className="text-xl text-center font-medium mb-4">Silahkan Login Untuk Melanjutkan</p>
                {/* Form Login */}
                <LoginForm onLogin={handleLogin} />
            </div>
        </Layout>
    );
};

export default LoginPage;
