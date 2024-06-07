import React, { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import BottomBar from '../components/BottomBar';
import Link from 'next/link';
import { useAuth } from './context/authContext';
import NewsList from '@/components/NewsList';
import axios from 'axios';

const HomePage = () => {
    const { user } = useAuth();
    const [showSplash, setShowSplash] = useState(true);
    const [isTimeValid, setIsTimeValid] = useState(true);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);

        const fetchConfig = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Token not found");
                }

                const response = await axios.get('https://api.nusa-sarat.nuncorp.id/api/v1/config/filter', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.data.code === 200) {
                    const { start_pre_test, end_pre_test } = response.data.body;
                    const currentTime = new Date();

                    const [startHours, startMinutes] = start_pre_test.split(':');
                    const startTime = new Date();
                    startTime.setHours(startHours, startMinutes, 0, 0);

                    const [endHours, endMinutes] = end_pre_test.split(':');
                    const endTime = new Date();
                    endTime.setHours(endHours, endMinutes, 0, 0);

                    if (currentTime >= startTime && currentTime <= endTime) {
                        setIsTimeValid(true);
                    } else {
                        setIsTimeValid(false);
                    }
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error('Unauthorized: Token signature is invalid');
                    // Handle unauthorized error, for example, redirect to login
                } else {
                    console.error('Error fetching config:', error);
                }
                setIsTimeValid(false);
            }
        };

        fetchConfig();
        return () => clearTimeout(timer);
    }, []);

    const sliderImages = [
        '/images/jasmani.png',
        '/images/tematik.png',
        '/images/al-quran.png',
    ];

    const saratImages = [
        '/images/exam.png',
        '/images/Accept.png',
        '/images/history_nusa.png',
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '0',
                },
            },
        ],
    };

    return (
        <>
            <Navbar />
            <Layout>
                <div className='bg-white min-h-full flex flex-col items-center overflow-hidden dark:text-white'>
                    {showSplash ? <SplashScreen /> : (
                        <>
                            <div className='w-full'>
                                <div className='pt-4'>
                                    <Slider {...settings} className="px-4">
                                        {sliderImages.map((image, index) => (
                                            <div key={index} className="w-full h-60 sm:h-72 md:h-80 relative px-2">
                                                <div className="w-full h-full relative rounded-md overflow-hidden">
                                                    <Image
                                                        src={image}
                                                        alt={`Slider ${index + 1}`}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded-md transition-transform duration-500 hover:scale-105"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                                <div className="mt-6 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                                    {/* Card 1 - Submit Sarat */}
                                    <Link href={user ? "/Presensi" : "/Login"}>
                                        <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex flex-col h-54">
                                            <div className="flex items-center justify-center h-32">
                                                <div className="relative h-32 w-32 sm:h-40 sm:w-40">
                                                    <Image
                                                        src={saratImages[1]}
                                                        alt="Submit Sarat"
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded-t-lg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-4 bg-red-800 text-white rounded-b-lg flex items-center justify-between">
                                                <h2 className="text-sm font-semibold">Presensi Sarat</h2>
                                                <FontAwesomeIcon icon={faArrowRight} style={{ width: '20px', height: '20px' }} />
                                            </div>
                                        </div>
                                    </Link>
                                    {/* Card 2 - Pre-Test Sarat */}
                                    <Link href={isTimeValid && user ? "/PreTest" : "/Login"}>
                                        <div className={`bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-54 ${isTimeValid ? 'hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}>
                                            <div className="flex items-center justify-center h-32">
                                                <div className="relative h-32 w-32 sm:h-40 sm:w-40">
                                                    <Image
                                                        src={saratImages[0]}
                                                        alt="Pre-Test Sarat"
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded-t-lg"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-4 bg-red-800 text-white rounded-b-lg flex items-center justify-between">
                                                <h2 className="text-sm font-semibold">Pre-Test Sarat</h2>
                                                <FontAwesomeIcon icon={faArrowRight} style={{ width: '20px', height: '20px' }} />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="w-full mt-6 sm:mt-12 mb-6 bg-gray-200 h-0.5 rounded-sm"></div>
                                <h1 className="text-2xl font-semibold mb-4 ml-4">News</h1>
                                <div className='flex flex-col items-center px-4'>
                                    <NewsList />
                                </div>
                            </div>
                            <BottomBar />
                        </>
                    )}
                </div>
            </Layout>
        </>
    );
};

export default HomePage;
