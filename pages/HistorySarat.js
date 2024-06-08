import React, { useEffect, useState } from 'react';
import { useAuth } from './context/authContext';
import Layout from '@/components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Link from 'next/link';

const History = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState(null); // Initialize with null
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Anda harus login untuk melihat riwayat');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('https://api.nusa-sarat.nuncorp.id/api/v1/session/report?user_id=24', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setHistory(data.body || []); // Set to an empty array if data.body is null
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Gagal mengambil data riwayat');
                }
            } catch (err) {
                setError('Terjadi kesalahan. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <Layout>
            <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={{ width: '20px', height: '20px' }}
                    onClick={() => router.back()}
                    className="cursor-pointer"
                />
                <h2 className="text-lg font-semibold">Riwayat Sesi</h2>
                <div className="w-6" />
            </div>
            <div className="container mx-auto p-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {loading && <p className="text-center">Loading...</p>}
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    {!loading && !error && (
                        <>
                            {history === null || history.length === 0 ? (
                                <p className="text-center text-gray-600">Tidak ada data riwayat sesi yang tersedia.</p>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((session) => (
                                        <Link href={`/history/${session.id}`} key={session.id} legacyBehavior>
                                            <a className="block bg-gray-100 p-4 rounded-lg shadow-inner hover:bg-gray-200">
                                                <div className="mb-2">
                                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Judul Sesi:</label>
                                                    <p className="text-lg text-gray-800 font-semibold">{session.session_detail.title}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Deskripsi:</label>
                                                    <p className="text-lg text-gray-800 font-semibold">{session.session_detail.description}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Waktu Mulai:</label>
                                                    <p className="text-lg text-gray-800 font-semibold">{session.start_time}</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Waktu Selesai:</label>
                                                    <p className="text-lg text-gray-800 font-semibold">{session.end_time || '-'}</p>
                                                </div>
                                            </a>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default History;
