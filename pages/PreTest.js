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
                    const updatedInstitutionData = [...institutionData.body, { id: 5, name: 'Squad AIM' }];
                    setInstitutionOptions(updatedInstitutionData);
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

    const handleNextPage = async () => {
        if (currentPage === 1) {
            setCurrentPage(currentPage + 1);
        } else if (currentPage === 2) {
            setCurrentPage(currentPage + 1);
        } else if (currentPage === 3) {
            try {
                const token = localStorage.getItem('token');
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
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
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
            const token = localStorage.getItem('token');
            let dataAnswers = [];
            questions.forEach((question) => {
                const selectedAnswer = formData[`question_${question.id}`];
                dataAnswers.push({
                    question_id: question.id,
                    answer: selectedAnswer,
                });
            });

            let data = JSON.stringify({
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
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.nusa-sarat.nuncorp.id/api/v1/session/answer',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                data: data,
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.error('Second API Response Error:', error);
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
                        {currentPage === 2 && formData.institution_id === 5 && (
                            <>
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
                            </>
                        )}
                        {currentPage === 2 && formData.institution_id !== 5 && (
                            <>
                                {questions.map((question) => (
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
