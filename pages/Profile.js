import React, { useEffect } from 'react';
import { useAuth } from './context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Layout from '@/components/Layout';
import Link from 'next/link';
import BottomBar from '../components/BottomBar';
import { useRouter } from 'next/router';

const Profile = () => {
    const { user, fetchProfile } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile(token);
        }
    }, [fetchProfile]);

    return (
        <>
            <Layout>
                <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                    <FontAwesomeIcon icon={faArrowLeft} style={{ width: '20px', height: '20px' }} onClick={() => router.back()} />
                    <h2 className="text-lg font-semibold">Profil</h2>
                    <div className="w-6" />
                </div>
                <div className="container mx-auto p-8 mt-32 mb-20">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="mb-8 text-center">
                            <img
                                src="/images/logo_SAIM.png"
                                alt="Avatar"
                                className="mx-auto mb-4 w-40 h-40 rounded-full object-cover border-4 border-white shadow-md"
                            />
                            <h3 className="text-2xl font-bold text-gray-800">{user?.fullname}</h3>
                        </div>

                        {/* Bagian Detail Profil */}
                        <div className="space-y-4">
                            {user?.students?.map((student) => (
                                <div key={student.id} className="bg-gray-100 p-4 rounded-lg shadow-inner">
                                    <div className="mb-2">
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Nama Anak:</label>
                                        <p className="text-lg text-gray-800 font-semibold">{student.student_name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Kelas Anak:</label>
                                        <p className="text-lg text-gray-800 font-semibold">{student.class}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <Link href="/ChangePasword" legacyBehavior>
                                <a className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Ganti Password</a>
                            </Link>
                        </div>

                        {!user && (
                            <div className="mt-8 text-center">
                                <Link href="/login" legacyBehavior>
                                    <a className="text-red-800 hover:underline">Login</a>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
                <BottomBar />
            </Layout>
        </>
    );
};

export default Profile;
