import React from 'react';
import { useAuth } from './context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Layout from '@/components/Layout';
import Link from 'next/link';
import BottomBar from '../components/BottomBar';

const Profile = () => {
    const { user } = useAuth();

    return (
        <>
            <Layout>
                <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                    <FontAwesomeIcon icon={faArrowLeft} style={{ width: '20px', height: '20px' }} onClick={() => router.back()} />
                    <h2 className="text-lg font-semibold text-center">Profil Pengguna</h2>
                    <div className="w-6" />
                </div>
                <div className="container min-h-screen p-8 bg-white shadow-md rounded-md flex flex-col items-center justify-center">
                    <div className="mb-8">
                        <img
                            src="images/logo SAIM 1.png"
                            alt="Avatar"
                            className="mx-auto mb-2 w-50 h-50 rounded-full object-cover"
                        />
                    </div>

                    {/* Bagian Detail Profil */}
                    <div className="col-span-2">
                        <div className="mb-4 border-b pb-2 text-center">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Nama:</label>
                            <p className="text-lg text-gray-800 font-semibold">{user?.body?.fullname}</p>
                        </div>
                        <div className="mb-4 border-b pb-2 text-center">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Email:</label>
                            <p className="text-gray-800">{user?.body?.email}</p>
                        </div>
                        <div className="mb-4 border-b pb-2 text-center">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Nomor Telepon:</label>
                            <p className="text-gray-800">{user?.body?.phone}</p>
                        </div>
                    </div>

                    {!user && (
                        <div className="mt-8 text-center">
                            <Link href="/login">
                                <a className="text-red-800 hover:underline">Login</a>
                            </Link>
                        </div>
                    )}
                </div>
                <BottomBar />
            </Layout>
        </>
    );
};

export default Profile;
