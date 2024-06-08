import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

const HistoryDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Anda harus login untuk melihat detail riwayat');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`https://api.nusa-sarat.nuncorp.id/api/v1/session/report/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDetail(data.body);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Gagal mengambil detail riwayat');
                }
            } catch (err) {
                setError('Terjadi kesalahan. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetail();
        }
    }, [id]);

    return (
        <Layout>
            <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                <FontAwesomeIcon
                    icon={faArrowLeft}
                    style={{ width: '20px', height: '20px' }}
                    onClick={() => router.back()}
                    className="cursor-pointer"
                />
                <h2 className="text-lg font-semibold">Detail Riwayat Sesi</h2>
                <div className="w-6" />
            </div>
            <div className="container mx-auto p-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {loading && <p className="text-center">Loading...</p>}
                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    {detail && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">{detail.session_detail.title}</h3>
                            <p className="text-gray-700 mb-2">Deskripsi: {detail.session_detail.description}</p>
                            <p className="text-gray-700 mb-2">Waktu Mulai: {detail.start_time}</p>
                            <p className="text-gray-700 mb-2">Waktu Selesai: {detail.end_time || 'Belum selesai'}</p>
                            <p className="text-gray-700 mb-2">Alasan Terlambat: {detail.reason_late}</p>
                            <p className="text-gray-700 mb-2">Alasan Hadir Online: {detail.reason_attend_online}</p>
                            <p className="text-gray-700 mb-2">Alasan Absen: {detail.reason_absent}</p>
                            <h4 className="text-lg font-bold mt-6 mb-2">Hasil Jawaban:</h4>
                            {detail.answer_result.map((result) => (
                                <div key={result.id} className="bg-gray-100 p-4 rounded-lg shadow-inner mb-4">
                                    <p className="text-gray-700 mb-2"><strong>Pertanyaan:</strong> {result.question.question}</p>
                                    <p className="text-gray-700 mb-2"><strong>Jawaban Anda:</strong> {result.answer_description}</p>
                                    <p className="text-gray-700 mb-2"><strong>Jawaban Benar:</strong> {result.correct_answer}</p>
                                    <p className={`text-gray-700 mb-2 ${result.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                                        {result.is_correct ? 'Benar' : 'Salah'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default HistoryDetail;
