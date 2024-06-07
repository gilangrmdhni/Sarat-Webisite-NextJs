import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useAuth } from './context/authContext';
import axios from 'axios';
import { usePreTestData } from './context/PreTestContext';

const PreTest = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { formData, setFormData, questions, setQuestions } = usePreTestData();
    const user_id = user?.user_id || null;
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const [sessionOptions, setSessionOptions] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [fileInputs, setFileInputs] = useState({});
    const [lateHour, setLateHour] = useState('');

    const fetchQuestions = async (sessionDetailId) => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = `https://api.nusa-sarat.nuncorp.id/api/v1/question/filter?session_detail=${sessionDetailId}&flag=PRE_TEST`;
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                setQuestions(responseData.body);
            } else {
                console.error('API Error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    useEffect(() => {
        const fetchLateHour = async () => {
            try {
                const token = localStorage.getItem('token');
                const apiUrl = 'https://api.nusa-sarat.nuncorp.id/api/v1/config/filter';
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    const { late_hour } = responseData.body;
                    setLateHour(late_hour);
                } else {
                    console.error('Failed to fetch late hour:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching late hour:', error);
            }
        };

        const fetchSessionOptions = async () => {
            const token = localStorage.getItem('token');
            try {
                const apiUrl = 'https://api.nusa-sarat.nuncorp.id/api/v1/session/active';
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    const sessionData = responseData.body.details;
                    setSessionOptions(sessionData);
                } else {
                    console.error('API Error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching session options:', error);
            }
        };

        const fetchInstitutionOptions = async () => {
            const token = localStorage.getItem('token');
            try {
                const apiUrl = 'https://api.nusa-sarat.nuncorp.id/api/v1/institution/filter';
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const institutionData = await response.json();
                    setInstitutionOptions(institutionData.body);
                } else {
                    console.error('API Error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching institution options:', error);
            }
        };

        fetchLateHour();
        fetchSessionOptions();
        fetchInstitutionOptions();
    }, []);

    useEffect(() => {
        if (formData.session_detail_id) {
            fetchQuestions(formData.session_detail_id);
        }
    }, [formData.session_detail_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e, questionId) => {
        const file = e.target.files[0];
        setFileInputs({
            ...fileInputs,
            [questionId]: file,
        });
    };

    const handleNextPage = async () => {
        if (currentPage === 1) {
            if (!formData.session_detail_id || !formData.parent_type || !formData.parent_phone || !formData.start_time) {
                alert("Please fill in all required fields.");
                return;
            }
            if (formData.institution_id === '5') {
                setCurrentPage(currentPage + 1);
            } else {
                setCurrentPage(currentPage + 2);
            }
        } else if (currentPage === 2) {
            if (formData.institution_id === '5' && !formData.squad) {
                alert("Please select a squad.");
                return;
            }
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        setTimeout(async () => {
            try {
                const token = localStorage.getItem('token');
                let dataAnswers = [];

                for (const question of questions) {
                    if (fileInputs[question.id]) {
                        const fileData = new FormData();
                        fileData.append('file', fileInputs[question.id]);
                        fileData.append('destination', 'resume');
                        fileData.append('name', 'resume');

                        const uploadResponse = await axios.post('https://api.nusa-sarat.nuncorp.id/api/v1/media/upload', fileData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        const fileUrl = uploadResponse.data.body.file_url;
                        dataAnswers.push({
                            question_id: question.id,
                            answer: fileUrl,
                        });
                    } else {
                        const selectedAnswer = formData[`question_${question.id}`];
                        dataAnswers.push({
                            question_id: question.id,
                            answer: selectedAnswer || '',
                        });
                    }
                }

                const data = {
                    session_detail_id: parseInt(formData.session_detail_id),
                    institution_id: parseInt(formData.institution_id),
                    attendance_type: formData.attendance_type,
                    flag: 'PRE_TEST',
                    parent_type: formData.parent_type,
                    parent_phone: formData.parent_phone,
                    start_time: formData.start_time,
                    end_time: formData.end_time,
                    reason_late: formData.reason_late,
                    reason_attend_online: formData.reason_attend_online,
                    reason_absent: formData.reason_absent,
                    squad: formData.squad,
                    question_answers: dataAnswers,
                };

                const response = await axios.post(
                    'https://api.nusa-sarat.nuncorp.id/api/v1/session/answer',
                    data,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                console.log('Response dari API:', response.data);
                setSuccess('Data berhasil disimpan.');
                setShowPopup(true);
                setFormData({
                    session_detail_id: '',
                    parent_type: '',
                    parent_phone: '',
                    start_time: '',
                    end_time: '',
                    reason_late: '',
                    reason_attend_online: '',
                    reason_absent: '',
                    resume: '',
                    institution_id: '',
                    attendance_type: 'Hadir Offline',
                    flag: 'PRE_TEST',
                    resume_file: null,
                    squad: '',
                });
            } catch (error) {
                console.error('Error during form submission:', error);
                setError('Gagal menyimpan data. Silakan coba lagi.');
            } finally {
                setLoading(false);
            }
        }, 3000);
    };

    const handleSessionChange = (e) => {
        const sessionDetailId = e.target.value;
        setFormData({
            ...formData,
            session_detail_id: sessionDetailId,
        });

        if (sessionDetailId) {
            fetchQuestions(sessionDetailId);
        }
    };

    const handlePrevPage = () => {
        if (currentPage === 3) {
            if (formData.institution_id === '5') {
                setCurrentPage(2);
            } else {
                setCurrentPage(1);
            }
        } else {
            setCurrentPage(1);
        }
    };

    return (
        <div className="bg-white min-h-full">
            <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                <FontAwesomeIcon icon={faArrowLeft} style={{ width: '20px', height: '20px' }} onClick={() => router.back()} />
                <h2 className="text-lg font-semibold">Pre-Test</h2>
                <div className="w-6" />
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {success && <p className="text-center text-green-500">{success}</p>}
                    {currentPage === 1 && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="session_detail_id" className="block text-sm font-semibold text-gray-600 mb-1">Pilih Sesi:</label>
                                <select
                                    id="session_detail_id"
                                    name="session_detail_id"
                                    value={formData.session_detail_id}
                                    onChange={handleSessionChange}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                >
                                    <option value="" disabled>Pilih Sesi</option>
                                    {sessionOptions.map((session) => (
                                        <option key={session.id} value={session.id}>{session.title} : {session.description}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="parent_type" className="block text-sm font-semibold text-gray-600 mb-1">Status Wali Murid:</label>
                                <select
                                    id="parent_type"
                                    name="parent_type"
                                    value={formData.parent_type}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                >
                                    <option value="" disabled>Pilih Wali</option>
                                    <option value="FATHER">Ayah</option>
                                    <option value="MOTHER">Bunda</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="parent_phone" className="block text-sm font-semibold text-gray-600 mb-1">Nomor Hp Orang Tua:</label>
                                <input
                                    type="text"
                                    id="parent_phone"
                                    name="parent_phone"
                                    value={formData.parent_phone}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="attendance_type" className="block text-sm font-semibold text-gray-600 mb-1">
                                    Pilih Jenis Kehadiran:
                                </label>
                                <select
                                    id="attendance_type"
                                    name="attendance_type"
                                    value={formData.attendance_type}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                >
                                    <option value="Hadir Offline">Hadir Offline</option>
                                    <option value="Hadir Online">Hadir Online</option>
                                    <option value="Tidak Hadir(Sudah Izin)">Tidak Hadir(Sudah Izin)</option>
                                    <option value="Tidak Hadir(Ghaib)">Tidak Hadir(Ghaib)</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="start_time" className="block text-sm font-semibold text-gray-600 mb-1">Jam Mulai:</label>
                                <input
                                    type="time"
                                    id="start_time"
                                    name="start_time"
                                    value={formData.start_time}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="end_time" className="block text-sm font-semibold text-gray-600 mb-1">Jam Selesai :</label>
                                <input
                                    type="time"
                                    id="end_time"
                                    name="end_time"
                                    value={formData.end_time}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="reason_late" className="block text-sm font-semibold text-gray-600 mb-1">
                                    {`Alasan Terlambat (Diisi jika hadir setelah pukul ${lateHour} WIB):`}
                                </label>
                                <input
                                    type="text"
                                    id="reason_late"
                                    name="reason_late"
                                    value={formData.reason_late}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="reason_attend_online" className="block text-sm font-semibold text-gray-600 mb-1">Alasan Hadir Online (Diisi jika hadir secara online):</label>
                                <input
                                    id="reason_attend_online"
                                    name="reason_attend_online"
                                    value={formData.reason_attend_online}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="reason_absent" className="block text-sm font-semibold text-gray-600 mb-1">Alasan Tidak Hadir Sama Sekali di Hari Offline (Diisi jika tidak hadir baik offline maupun online):</label>
                                <input
                                    id="reason_absent"
                                    name="reason_absent"
                                    value={formData.reason_absent}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="institution_id" className="block text-sm font-semibold text-gray-600 mb-1">Pilih Institusi:</label>
                                <select
                                    id="institution_id"
                                    name="institution_id"
                                    value={formData.institution_id}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                >
                                    <option value="" disabled>Pilih Institusi</option>
                                    {institutionOptions.map((institution, index) => (
                                        <option key={institution.id} value={institution.id}>{institution.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={handleNextPage}
                                className="w-full bg-red-800 text-white py-3 px-4 rounded-md hover:bg-red-600"
                            >
                                Next
                            </button>
                        </>
                    )}
                    {currentPage === 2 && formData.institution_id === '5' && (
                        <>
                            <div className="mb-4 h-screen p-6 rounded shadow-md w-full max-w-lg">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Squad:</label>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            name="squad"
                                            value="Abu Hanifah"
                                            onChange={handleChange}
                                            checked={formData.squad === 'Abu Hanifah'}
                                            className='mr-2'
                                        />
                                        Abu Hanifah
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            name="squad"
                                            value="Syafi'i"
                                            onChange={handleChange}
                                            checked={formData.squad === "Syafi'i"}
                                            className='mr-2'
                                        />
                                        Syafi{"'"}i
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            name="squad"
                                            value="Maliki"
                                            onChange={handleChange}
                                            checked={formData.squad === 'Maliki'}
                                            className='mr-2'
                                        />
                                        Maliki
                                    </label>
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            name="squad"
                                            value="Hanbali"
                                            onChange={handleChange}
                                            checked={formData.squad === 'Hanbali'}
                                            className='mr-2'
                                        />
                                        Hanbali
                                    </label>
                                </div>
                                <div className='mt-8'>
                                    <button
                                        type="button"
                                        onClick={handleNextPage}
                                        className="w-full bg-red-800 text-white py-3 px-4 rounded-md hover:bg-red-600"
                                    >
                                        Next
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePrevPage}
                                        className="w-full mt-4 border border-gray-300 py-3 px-4 rounded-md hover:border-red-500"
                                    >
                                        Previous
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                    {currentPage === 3 && questions.length > 0 && (
                        <>
                            {questions.map((question) => (
                                <div key={question.id}>
                                    <QuestionField
                                        question={question}
                                        handleChange={handleChange}
                                        handleFileChange={handleFileChange}
                                        formData={formData}
                                    />
                                </div>
                            ))}
                            <button
                                type="submit"
                                className={`w-full py-3 px-4 rounded-md ${loading ? 'bg-gray-400' : 'bg-red-800 hover:bg-red-600'} text-white`}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Submit'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (currentPage === 3) {
                                        if (formData.institution_id === '5') {
                                            setCurrentPage(2); // Jika di page 3 dan institution_id adalah '5', kembali ke page 2
                                        } else {
                                            setCurrentPage(1); // Jika di page 3 dan institution_id bukan '5', kembali ke page 1
                                        }
                                    } else {
                                        setCurrentPage(1); // Kembali ke page 1 jika saat ini di page 2
                                    }
                                }}
                                className="w-full mt-4 border border-gray-300 py-3 px-4 rounded-md hover:border-red-500"
                                disabled={loading}
                            >
                                Previous
                            </button>

                        </>
                    )}
                    {currentPage === 3 && questions.length === 0 && (
                        <p className="text-center text-red-500">No questions available for this session.</p>
                    )}
                </form>
            </div>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md text-center">
                        <h2 className="text-lg font-semibold mb-4">Data Berhasil Disimpan</h2>
                        <button
                            onClick={() => router.push('/HomePage')}
                            className="bg-red-800 text-white py-2 px-4 rounded hover:bg-red-600"
                        >
                            Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const QuestionField = ({ question, handleChange, handleFileChange, formData }) => {
    return (
        <div key={question.id}>
            <fieldset className="mb-4">
                <legend className="block text-sm font-semibold text-gray-600 mb-1">{question.question}</legend>
                <ul>
                    {question.question_type === 'ESSAY' ? (
                        <li>
                            <textarea
                                id={`question_${question.id}`}
                                name={`question_${question.id}`}
                                value={formData[`question_${question.id}`] || ''}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            />
                        </li>
                    ) : question.question_type === 'UPLOAD' ? (
                        <li>
                            <input
                                type="file"
                                id={`file_question_${question.id}`}
                                name={`file_question_${question.id}`}
                                onChange={(e) => handleFileChange(e, question.id)}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            />
                        </li>
                    ) : (
                        question.question_details.map((choice) => (
                            <li key={choice.id}>
                                <input
                                    type="radio"
                                    id={`choice_${choice.id}`}
                                    name={`question_${question.id}`}
                                    value={choice.id}
                                    onChange={handleChange}
                                />
                                <label htmlFor={`choice_${choice.id}`} className="ml-2">{choice.description}</label>
                            </li>
                        ))
                    )}
                </ul>
            </fieldset>
        </div>
    );
};

export default PreTest;
