// pages/login.js
import React from 'react';
import LoginForm from '../components/LoginForm';
import { useAuth } from './authContext';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

const LoginPage = () => {
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async ({ email, password }) => {
        try {
            await login({ email, password });

            // Jika login berhasil, arahkan pengguna ke halaman lain
            router.push('/HomePage');
        } catch (error) {
            console.error('Login error:', error.message);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                {/* Logo Web Anda */}
                <img src="images/logo SAIM 1.png" alt="Logo Web" className="w-50 h-50 mb-4" />

                {/* Sambutan */}
                <p className="text-xl text-center font-bold mb-4">Assalamualaikum, Silahkan Login Untuk Melanjutkan</p>
                {/* Form Login */}
                <LoginForm onLogin={handleLogin} />
            </div>
        </Layout>
    );
};

export default LoginPage;
