import React, { useState } from 'react';
import { useAuth } from './context/authContext';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError('Password baru dan konfirmasi password tidak cocok');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Anda harus login untuk mengubah password');
            return;
        }

        try {
            const response = await fetch('https://api.nusa-sarat.nuncorp.id/api/v1/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                }),
            });

            if (response.ok) {
                setSuccess('Password berhasil diubah');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Gagal mengubah password');
            }
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.');
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-8">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-center">Ganti Password</h2>
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    {success && <p className="text-green-600 mb-4">{success}</p>}
                    <form onSubmit={handleChangePassword}>
                        <div className="mb-4 relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password Lama</label>
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password Baru</label>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <FontAwesomeIcon
                                icon={showNewPassword ? faEyeSlash : faEye}
                                className="absolute right-3 top-9 cursor-pointer"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Konfirmasi Password Baru</label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Ganti Password
                            </button>
                            <button
                                type="button"
                                className="text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => router.back()}
                            >
                                Kembali
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ChangePassword;
