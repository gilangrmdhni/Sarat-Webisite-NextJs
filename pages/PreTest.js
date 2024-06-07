import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useAuth } from './authContext';
import axios from 'axios';

const PreTest = () => {
    const router = useRouter();
    const { user } = useAuth();

    const user_id = user?.user_id || null;
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        session_detail_id: '',
        parent_type: '',
        student_name: '',
        student_class: '',
        parent_name: '',
        parent_phone: '',
        start_time: '',
        end_time: '',
        reason_late: '',
        institution_id: '',
        attendance_type: 'Hadir Offline',
        reason_attend_online: '',
        reason_absent: '',
        squad: '',
        session_answer_id: '',
    });

    const [sessionOptions, setSessionOptions] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [questions, setQuestions] = useState([]);
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
    
        fetchLateHour();
    }, []);
    


    useEffect(() => {
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

        fetchSessionOptions();
        fetchInstitutionOptions();
    }, []);

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
            // Validasi halaman pertama
            if (!formData.session_detail_id || !formData.parent_type || !formData.parent_phone || !formData.start_time) {
                alert("Please fill in all required fields.");
                return;
            }
            if (formData.institution_id === '5') {
                setCurrentPage(currentPage + 1); // Navigate to page 2 (Squad selection) if institution is 'Squad AIM'
            } else {
                setCurrentPage(currentPage + 2); // Navigate directly to page 3 (Questions) for other institutions
            }
        } else if (currentPage === 2) {
            // Validasi halaman kedua
            if (formData.institution_id === '5' && !formData.squad) {
                alert("Please select a squad.");
                return;
            }
            setCurrentPage(currentPage + 1); // Navigate to page 3 (Questions)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            let dataAnswers = [];

            questions.forEach((question) => {
                const selectedAnswer = formData[`question_${question.id}`];
                dataAnswers.push({
                    question_id: question.id,
                    answer: selectedAnswer || '',
                });

                if (fileInputs[question.id]) {
                    dataAnswers.push({
                        question_id: question.id,
                        answer: fileInputs[question.id],
                    });
                }
                router.push('/HomePage');
            });

            const submissionData = {
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
                submissionData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Response dari API:', response.data);
            setSuccess('Data berhasil disimpan.');
        } catch (error) {
            if (error.response) {
                console.error('Response error data:', error.response.data);
                console.error('Response error status:', error.response.status);
                console.error('Response error headers:', error.response.headers);
            } else if (error.request) {
                console.error('Request error data:', error.request);
            } else {
                console.error('General error message:', error.message);
            }
            console.error('Full error config:', error.config);
            setError('Gagal menyimpan data. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
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
        setCurrentPage(currentPage - 1);
    };

    return (
        <div className="bg-white ">
            <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                <FontAwesomeIcon icon={faArrowLeft} style={{ width: '20px', height: '20px' }} onClick={() => router.back()} />
                <h2 className="text-lg font-semibold">Pre-Test</h2>
                <div className="w-6" />
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md w-full">
                    {loading && <p className="text-center text-red-500">Loading...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {success && <p className="text-center text-green-500">{success}</p>}
                    {/* Page 1 */}
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
                                    required
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
                                    required
                                >
                                    <option value="" disabled>Pilih Wali</option>
                                    <option value="FATHER">Ayah</option>
                                    <option value="MOTHER">Bunda</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="parent_phone" className="block text-sm font-semibold text-gray-600 mb-1">Nomor HP Wali Murid:</label>
                                <input
                                    type="text"
                                    id="parent_phone"
                                    name="parent_phone"
                                    value={formData.parent_phone}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    required
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
                                    required
                                >
                                    <option value="Hadir Offline">Hadir Offline</option>
                                    <option value="Hadir Online">Hadir Online</option>
                                    <option value="Tidak hadir (sudah izin)">Tidak hadir (sudah izin)</option>
                                    <option value="Tidak hadir (Ghaib)">Tidak hadir (Ghaib)</option>
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
                                    required
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
                                    type="text"
                                    id="reason_attend_online"
                                    name="reason_attend_online"
                                    value={formData.reason_attend_online}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="reason_absent" className="block text-sm font-semibold text-gray-600 mb-1">Alasan Tidak Hadir Sama Sekali (Diisi jika tidak hadir baik offline maupun online):</label>
                                <input
                                    type="text"
                                    id="reason_absent"
                                    name="reason_absent"
                                    value={formData.reason_absent}
                                    onChange={handleChange}
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
                                    required
                                >
                                    <option value="" disabled>Pilih Institusi</option>
                                    {institutionOptions.map((institution) => (
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
                    {/* Page 2 */}
                    {currentPage === 2 && formData.institution_id === '5' && (
                        <>
                            <div className="mb-4 h-screen bg-white p-6 rounded shadow-md w-full max-w-lg">
                                <fieldset className="mb-4">
                                    <legend className="block text-sm font-semibold text-gray-600 mb-1">Squad</legend>
                                    <ul>
                                        <li>
                                            <input
                                                type="radio"
                                                id="squad_1"
                                                name="squad"
                                                value="Abu Hanifah"
                                                onChange={handleChange}
                                                className='mr-2'
                                            />
                                            <label htmlFor="squad_1" className="ml-2">Abu Hanifah</label>
                                        </li>
                                        <li>
                                            <input
                                                type="radio"
                                                id="squad_2"
                                                name="squad"
                                                value="Syafi'i"
                                                onChange={handleChange}
                                                className='mr-2'
                                            />
                                            <label htmlFor="squad_2" className="ml-2">Syafi{"'"}i</label>
                                        </li>
                                        <li>
                                            <input
                                                type="radio"
                                                id="squad_3"
                                                name="squad"
                                                value="Maliki"
                                                onChange={handleChange}
                                                className='mr-2'
                                            />
                                            <label htmlFor="squad_3" className="ml-2">Maliki</label>
                                        </li>
                                        <li>
                                            <input
                                                type="radio"
                                                id="squad_4"
                                                name="squad"
                                                value="Hanbali"
                                                onChange={handleChange}
                                                className='mr-2'
                                            />
                                            <label htmlFor="squad_4" className="ml-2">Hanbali</label>
                                        </li>
                                    </ul>
                                </fieldset>

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

                        </>
                    )}
                    {currentPage === 3 && (
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
                                className="w-full bg-red-800 text-white py-3 px-4 rounded-md hover:bg-red-600"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={handlePrevPage}
                                className="w-full mt-4 border border-gray-300 py-3 px-4 rounded-md hover:border-red-500"
                            >
                                Previous
                            </button>
                        </>
                    )}
                </form>
            </div>
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
