import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useAuth } from './authContext';
import axios from 'axios';

const PreTest = () => {
    const router = useRouter();
    const { user } = useAuth();

    const user_id = user?.body?.id || null;
    const [currentPage, setCurrentPage] = useState(1);
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
        online_presence: '',
        offline_presence: '',
        hardcoded_name_title: '',
        session_answer_id: ''
    });

    const [sessionOptions, setSessionOptions] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);
    const [questions, setQuestions] = useState([]);

    const fetchQuestions = async (sessionDetailId) => {
        try {
            const apiUrl = `https://api.nusa-sarat.nuncorp.id/api/v1/question/filter?session_detail=${sessionDetailId}`;
            const response = await fetch(apiUrl);

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
        const fetchSessionOptions = async () => {
            try {
                const apiUrl = 'https://api.nusa-sarat.nuncorp.id/api/v1/session/active';
                const response = await fetch(apiUrl, { method: 'GET' });

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
            try {
                const apiUrl = 'https://api.nusa-sarat.nuncorp.id/api/v1/institution/filter';
                const response = await fetch(apiUrl, { method: 'GET' });

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            resume_file: file,
        });
    };

    const handleNextPage = async () => {
        if (currentPage === 1) {
            setCurrentPage(currentPage + 1);
        } else if (currentPage === 2) {
            setCurrentPage(currentPage + 1);
        } else if (currentPage === 3) {
            try {
                const firstApiUrl = 'https://api.nusa-sarat.nuncorp.id/api/v1/session/resume/answer';
                const firstFormData = new FormData();

                for (const key in formData) {
                    if (key !== 'session_answer_id') {
                        firstFormData.append(key, formData[key]);
                    }
                }

                firstFormData.append('user_id', String(user_id || ''));

                const firstApiResponse = await fetch(firstApiUrl, {
                    method: 'POST',
                    body: firstFormData,
                });

                const firstResponseData = await firstApiResponse.json();

                if (firstApiResponse.ok) {
                    console.log('First API Response:', firstResponseData);

                    const sessionAnswerId = firstResponseData.body.id;
                    localStorage.setItem("sessionAnswerId", sessionAnswerId);

                    setFormData({
                        ...formData,
                        session_answer_id: sessionAnswerId,
                    });
                } else {
                    console.error('First API Error:', firstApiResponse.status, firstApiResponse.statusText);
                    if (firstResponseData && firstResponseData.error) {
                        console.error('First API Error Details:', firstResponseData.error);
                    }
                }
            } catch (error) {
                console.error('Error during first API call:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let dataAnswers = [];
            questions.forEach((question) => {
                const selectedChoice = formData[`question_${question.id}`];
                dataAnswers.push({
                    question_id: question.id,
                    question_detail_id: parseInt(selectedChoice),
                });
            });

            let data = JSON.stringify({
                user_id: user_id,
                session_answer_id: parseInt(localStorage.getItem("sessionAnswerId")),
                answers: dataAnswers,
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.nusa-sarat.nuncorp.id/api/v1/exams/answer',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: data,
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.log(error);
                    console.log('Second API Response:', error);
                });

        } catch (error) {
            console.error('Error during form submission:', error);
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
        <Layout>
            <div className="bg-white min-h-full">
                <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                    <FontAwesomeIcon icon={faArrowLeft} style={{ width: '20px', height: '20px' }} onClick={() => router.back()} />
                    <h2 className="text-lg font-semibold">Pre-Test</h2>
                    <div className="w-6" />
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                        {/* Page 1 */}
                        {currentPage === 1 && (
                            <>
                                {/* Session Options */}
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
                                    <label htmlFor="parent_name" className="block text-sm font-semibold text-gray-600 mb-1">Nama Wali Murid:</label>
                                    <input
                                        type="text"
                                        id="parent_name"
                                        name="parent_name"
                                        value={formData.parent_name}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="student_name" className="block text-sm font-semibold text-gray-600 mb-1">Nama Murid:</label>
                                    <input
                                        type="text"
                                        id="student_name"
                                        name="student_name"
                                        value={formData.student_name}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="student_class" className="block text-sm font-semibold text-gray-600 mb-1">Kelas Murid:</label>
                                    <input
                                        type="text"
                                        id="student_class"
                                        name="student_class"
                                        value={formData.student_class}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    />
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
                                        <option value="Ayah">Ayah</option>
                                        <option value="Bunda">Bunda</option>
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
                                    <label htmlFor="reason_late" className="block text-sm font-semibold text-gray-600 mb-1"> Alasan Hadir Terlambat (Diisi jika hadir setelah pukul 06.45 WIB):</label>
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
                                    <label htmlFor="online_presence" className="block text-sm font-semibold text-gray-600 mb-1">Alasan Hadir Online (Diisi jika hadir secara online):</label>
                                    <input
                                        id="online_presence"
                                        name="online_presence"
                                        value={formData.online_presence}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="offline_presence" className="block text-sm font-semibold text-gray-600 mb-1">Alasan Alasan Tidak Hadir Sama Sekali di Hari Offline (Diisi jika tidak hadir baik offline maupun online):</label>
                                    <input
                                        id="offline_presence"
                                        name="offline_presence"
                                        value={formData.offline_presence}
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
                        {currentPage === 2 && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="hardcoded_name" className="block text-sm font-semibold text-gray-600 mb-1">Nama Lengkap Berikut Gelar:</label>
                                    <input
                                        type="text"
                                        id="hardcoded_name_title"
                                        name="hardcoded_name_title"
                                        value={formData.hardcoded_name}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    />
                                </div>
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
                            </>
                        )}
                        {/* Page 3 */}
                        {currentPage === 3 && (
                            <>
                                {questions.map((question) => (
                                    <div key={question.id}>
                                        <fieldset className="mb-4">
                                            <legend className="block text-sm font-semibold text-gray-600 mb-1">{question.description}</legend>
                                            <ul>
                                                {question.question_details.map((choice) => (
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
                                                ))}
                                            </ul>
                                        </fieldset>
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
        </Layout>
    );
};

export default PreTest;
