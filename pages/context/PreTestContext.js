import React, { createContext, useContext, useState, useEffect } from 'react';

const PreTestContext = createContext();

export const PreTestProvider = ({ children }) => {
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

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const savedFormData = localStorage.getItem('preTestFormData');
        if (savedFormData) {
            setFormData(JSON.parse(savedFormData));
        }

        const savedQuestions = localStorage.getItem('preTestQuestions');
        if (savedQuestions) {
            setQuestions(JSON.parse(savedQuestions));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('preTestFormData', JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        localStorage.setItem('preTestQuestions', JSON.stringify(questions));
    }, [questions]);

    return (
        <PreTestContext.Provider value={{ formData, setFormData, questions, setQuestions }}>
            {children}
        </PreTestContext.Provider>
    );
};

export const usePreTestData = () => useContext(PreTestContext);
