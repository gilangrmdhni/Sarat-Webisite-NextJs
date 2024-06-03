import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUpload } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useAuth } from './authContext';
import axios from 'axios';

const Presensi = () => {
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
        resume: '',
        institution_id: '',
        attendance_type: 'Hadir Offline',
        online_presence: '',
        offline_presence: '',
        resume_materi_satu: '',
        resume_materi_dua: '',
        resume_materi_tiga: '',
        resume_materi_empat: '',
        flag: 'ATTENDANCE',
        resume_file: null,
    });

    const [sessionOptions, setSessionOptions] = useState([]);
    const [institutionOptions, setInstitutionOptions] = useState([]);

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
            if (formData.institution_id === '5') {
                setCurrentPage(2); // Menampilkan halaman tambahan untuk "Squad AIM"
            } else {
                setCurrentPage(3); // Langsung ke halaman pertanyaan jika bukan "Squad AIM"
            }
        } else if (currentPage === 2) {
            setCurrentPage(3); // Pindah ke halaman pertanyaan setelah memilih squad
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


    const handlePrevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            let resumeFileUrl = '';
    
            if (formData.resume_file) {
                const fileData = new FormData();
                fileData.append('file', formData.resume_file);
    
                const uploadResponse = await axios.post('https://api.nusa-sarat.nuncorp.id/api/v1/media/upload', fileData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Sertakan token di sini
                    },
                });
    
                resumeFileUrl = uploadResponse.data.body.url; // Assuming the response contains the URL of the uploaded file
            }
    
            const dataAnswers = [
                {
                    question_id: 19,
                    answer: resumeFileUrl || formData.resume,
                },
                {
                    question_id: 22,
                    answer: formData.resume_materi_dua,
                },
            ];
    
            const data = {
                session_detail_id: parseInt(formData.session_detail_id),
                institution_id: parseInt(formData.institution_id),
                attendance_type: formData.attendance_type,
                flag: 'ATTENDANCE',
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
    
            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://api.nusa-sarat.nuncorp.id/api/v1/session/answer',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                },
                data: JSON.stringify(data),
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
    

    return (
        <Layout>
            <div className="bg-white min-h-full">
                <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                    <FontAwesomeIcon icon={faArrowLeft} style={{ width: '20px', height: '20px' }} onClick={() => router.back()} />
                    <h2 className="text-lg font-semibold">Presensi</h2>
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
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    >
                                        <option value="" disabled>Pilih Sesi</option>
                                        {sessionOptions.map((session) => (
                                            <option key={session.id} value={session.session_id}>{session.title} : {session.description}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="parent_name" className="block text-sm font-semibold text-gray-600 mb-1">Nama Orang Tua:</label>
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
                                    <label htmlFor="student_class" className="block text-sm font-semibold text-gray-600 mb-1">Kelas Siswa:</label>
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
                                    <label htmlFor="reason_late" className="block text-sm font-semibold text-gray-600 mb-1">Alasan Terlambat:</label>
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
                        {/* Page 2 - Squad AIM Selection */}
                        {currentPage === 2 && formData.institution_id === '5' && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Squad:</label>
                                    <div>
                                        <label>
                                            <input
                                                type="radio"
                                                name="squad"
                                                value="Abu Hanifah"
                                                onChange={handleChange}
                                                checked={formData.squad === 'Abu Hanifah'}
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
                                            />
                                            Hanbali
                                        </label>
                                    </div>
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
                                <div className="mb-4">
                                    <label htmlFor="resume_materi_satu" className="block text-sm font-semibold text-gray-600 mb-1">Jika nama Anda di form ini belum benar, atau belum ada gelar lengkapnya, berkenan Ayah/Bunda menuliskan revisi yang sempurnanya disini.</label>
                                    <input
                                        id="resume_materi_satu"
                                        name="resume_materi_satu"
                                        value={formData.resume_materi_satu}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="resume_materi_dua" className="block text-sm font-semibold text-gray-600 mb-1">Apakah hal baru dan menarik yang Ayah/Bunda peroleh dalam pertemuan ini?</label>
                                    <input
                                        id="resume_materi_dua"
                                        name="resume_materi_dua"
                                        value={formData.resume_materi_dua}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="resume_materi_tiga" className="block text-sm font-semibold text-gray-600 mb-1">Apakah ide dan gagasan terbaru Anda hari ini sebagai mitra strategis SekolahAdab.ID?</label>
                                    <input
                                        id="resume_materi_tiga"
                                        name="resume_materi_tiga"
                                        value={formData.resume_materi_tiga}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="resume_materi_empat" className="block text-sm font-semibold text-gray-600 mb-1">Diinformasikan bahwa Daurah Ayah akan dilaksanakan pada 29-30 Juni 2024 di Bogor. Siap hadir Ayah?</label>
                                    <input
                                        id="resume_materi_empat"
                                        name="resume_materi_empat"
                                        value={formData.resume_materi_empat}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="resume" className="block text-sm font-semibold text-gray-600 mb-1">Resume (Opsi 1)</label>
                                    <textarea
                                        id="resume"
                                        name="resume"
                                        value={formData.resume}
                                        onChange={handleChange}
                                        rows="4"
                                        className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="resume_file" className="block text-sm font-semibold text-gray-600 mb-1">Resume (Opsi 2):</label>
                                    <label className="relative cursor-pointer text-center">
                                        <input
                                            type="file"
                                            id="resume_file"
                                            name="resume_file"
                                            onChange={handleImageChange}
                                            accept=".pdf, .doc, .docx, .png, .jpg, .jpeg"
                                            className="hidden"
                                        />
                                        <div className="bg-gray-100 hover:bg-gray-200 p-3 border rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
                                            <FontAwesomeIcon icon={faUpload} className="mr-2" style={{ width: '15px', height: '15px' }} />
                                            <span>Upload File</span>
                                        </div>
                                    </label>
                                </div>
                                {formData.resume_file && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Nama File:</label>
                                        <p>{formData.resume_file.name}</p>
                                    </div>
                                )}
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

export default Presensi;
