import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const HistoryDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [sessionDetail, setSessionDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return; // Don't fetch if id is not available yet

        const fetchSessionDetail = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Anda harus login untuk melihat detail sesi');
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
                    setSessionDetail(data.body);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Gagal mengambil data sesi');
                }
            } catch (err) {
                setError('Terjadi kesalahan. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        };

        fetchSessionDetail();
    }, [id]);

    const renderMedia = (url) => {
        const fileUrl = `https://api.nusa-sarat.nuncorp.id/storage/${url}`;
        return (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Lihat file yang diunggah
            </a>
        );
    };

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
                    {!loading && !error && sessionDetail && (
                        <>
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-800">{sessionDetail.session_detail.title}</h3>
                                <p className="text-gray-700">{sessionDetail.session_detail.description}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Waktu Mulai:</label>
                                <p className="text-lg text-gray-800 font-semibold">{sessionDetail.start_time}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Waktu Selesai:</label>
                                <p className="text-lg text-gray-800 font-semibold">{sessionDetail.end_time || '-'}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Jenis Kehadiran:</label>
                                <p className="text-lg text-gray-800 font-semibold">{sessionDetail.attendance_type}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Institusi:</label>
                                <p className="text-lg text-gray-800 font-semibold">{sessionDetail.institution.name}</p>
                            </div>
                            <div className="mt-6">
                                <h4 className="text-lg font-bold text-gray-800">Jawaban Pertanyaan:</h4>
                                <div className="space-y-4 mt-4">
                                    {sessionDetail.answer_result.map((answer) => (
                                        <div key={answer.id} className="bg-gray-100 p-4 rounded-lg shadow-inner">
                                            <div className="mb-2">
                                                <label className="block text-sm font-semibold text-gray-600 mb-1">Pertanyaan:</label>
                                                <p className="text-gray-800">{answer.question.question}</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-600 mb-1">Jawaban Anda:</label>
                                                {answer.question.question_type === 'PG' ? (
                                                    <div className="text-gray-800">
                                                        {answer.answer}
                                                        {!answer.is_correct && (
                                                            <p className="text-red-600 mt-1">
                                                                <strong>Jawaban Benar:</strong> {answer.correct_answer}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : answer.question.question_type === 'UPLOAD' ? (
                                                    <div className="text-gray-800">
                                                        {renderMedia(answer.answer)}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-800">{answer.answer}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default HistoryDetail;
