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
import { useAuth } from './authContext';
import NewsList from '@/components/NewsList';

const HomePage = () => {
    const { user } = useAuth();
    const [showSplash, setShowSplash] = useState(true);
    const [isTimeValid, setIsTimeValid] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);

        const checkTimeValidity = () => {
            const currentTime = new Date();
            const validTime = new Date();
            validTime.setHours(6, 45, 0); // Set valid time to 06:45

            if (currentTime > validTime) {
                setIsTimeValid(false);
            }
        };

        checkTimeValidity();
        
        return () => clearTimeout(timer);
    }, []);

    const sliderImages = [
        '/images/slider1.png',
        '/images/slider2.png',
        '/images/slider3.png',
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
        centerPadding: '5%',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '5%',
                },
            },
        ],
    };

    return (
        <>
            <Navbar />
            <Layout>
                <div className='bg-white min-h-full items-center justify-center'>
                    {showSplash ? <SplashScreen /> : (
                        <>
                            <div>
                                <div className='pt-4'>
                                    <Slider {...settings} className="px-4">
                                        {sliderImages.map((image, index) => (
                                            <div key={index} className="w-full h-60 relative px-2">
                                                <div className="w-full h-full relative rounded-md overflow-hidden">
                                                    <Image
                                                        src={image}
                                                        alt={`Slider ${index + 1}`}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="rounded-md"
                                                        style={{ transform: 'scale(1)' }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 px-4">
                                    {/* Card 1 - Submit Sarat */}
                                    <Link href={user ? "/Presensi" : "/Login"}>
                                        <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 flex flex-col h-54">
                                            <div className="flex items-center justify-center h-32">
                                                <div className="relative h-40 w-40">
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
                                    <div className={`bg-white shadow-lg rounded-lg overflow-hidden flex flex-col h-54 ${isTimeValid ? 'hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}>
                                        <div className="flex items-center justify-center h-32">
                                            <div className="relative h-40 w-40">
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
                                            {isTimeValid ? (
                                                <Link href={user ? "/PreTest" : "/Login"}>
                                                    <FontAwesomeIcon icon={faArrowRight} style={{ width: '20px', height: '20px' }} />
                                                </Link>
                                            ) : (
                                                <FontAwesomeIcon icon={faArrowRight} style={{ width: '20px', height: '20px' }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full mt-12 mb-6 bg-gray-200 h-0.5 rounded-sm"></div>
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
