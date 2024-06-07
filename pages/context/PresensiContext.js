import { createContext, useContext, useState, useEffect } from 'react';

const PresensiContext = createContext();

export const PresensiProvider = ({ children }) => {
    const [formData, setFormData] = useState({
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
        flag: 'ATTENDANCE',
        resume_file: null,
        squad: '',
    });

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const savedFormData = localStorage.getItem('presensiFormData');
        const savedQuestions = localStorage.getItem('presensiQuestions');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }
        if (savedQuestions) {
            setQuestions(JSON.parse(savedQuestions));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('presensiFormData', JSON.stringify(formData));
        localStorage.setItem('presensiQuestions', JSON.stringify(questions));
    }, [formData, questions]);

    return (
        <PresensiContext.Provider value={{ formData, setFormData, questions, setQuestions }}>
            {children}
        </PresensiContext.Provider>
    );
};

export const usePresensiData = () => useContext(PresensiContext);
