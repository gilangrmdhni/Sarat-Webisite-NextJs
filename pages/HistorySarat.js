import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCalendarAlt, faHistory } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../pages/authContext'; // Sesuaikan path dengan struktur proyek Anda

const HistorySarat = () => {
    const router = useRouter();
    const { user } = useAuth(); // Ambil data user dari context
    const userId = user?.body?.id; // Ambil ID pengguna dari data user

    const [historyItems, setHistoryItems] = useState([]);

    useEffect(() => {
        // Fetch history data from the API using the user's ID
        const fetchHistoryData = async () => {
            try {
                if (userId) {
                    const apiUrl = `https://api.nusa-sarat.nuncorp.id/api/v1/session/resume/history/${userId}`;
                    const response = await fetch(apiUrl);

                    if (response.ok) {
                        const historyData = await response.json();
                        setHistoryItems(historyData.body); // Assuming the API response has a "body" property containing the history items
                    } else {
                        console.error('API Error:', response.status, response.statusText);
                        // Handle API error scenario
                    }
                } else {
                    console.error('User ID not available.');
                    // Handle the case where user ID is not available
                }
            } catch (error) {
                console.error('Error fetching history data:', error);
                // Handle other errors
            }
        };

        fetchHistoryData();
    }, [userId]); // Add userId to the dependency array to fetch data when userId changes

    return (
        <Layout>
            <div className="bg-white min-h-screen">
                <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                    <FontAwesomeIcon icon={faArrowLeft} style={{ width: '20px', height: '20px' }} onClick={() => router.back()} />
                    <h2 className="text-lg font-semibold">History Sarat</h2>
                    <div className="w-6" />
                </div>
                <div className="p-4">
                    <div className="max-w-md mx-auto">
                        <ul className="list-none">
                            {historyItems.map((item, index) => (
                                <li key={index} className="mb-6 bg-gray-100 p-4 rounded-md">
                                    <div className="flex items-center mb-2">
                                        <div className="bg-red-800 text-white rounded-full p-2 mr-4">
                                            <FontAwesomeIcon icon={faHistory} style={{ width: '18px', height: '18px' }} />
                                        </div>
                                        <div>
                                            <p className="text-gray-600">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" style={{ width: '18px', height: '18px' }} />
                                                {item.createdAt} {/* Tampilkan tanggal atau waktu yang sesuai */}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-semibold">{item.event}</p>
                                    <p>{item.student_name} - {item.student_class}</p>
                                    <p>Attendance Type: {item.attendance_type}</p>
                                    <p>Parent: {item.parent_name} ({item.parent_type})</p>
                                    <p>Reason for Late: {item.reason_late}</p>
                                    <p>Resume: {item.resume}</p>
                                    {/* Tambahkan informasi lain yang diperlukan */}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HistorySarat;
