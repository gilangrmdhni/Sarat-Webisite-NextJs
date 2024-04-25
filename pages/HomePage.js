import React, { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen'; // Import komponen splash screen
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import NewsCard from '../components/NewsCard';
import BottomBar from '../components/BottomBar';
import Link from 'next/link';
import { useAuth } from './authContext';
import { useRouter } from 'next/router';
import NewsList from '@/components/NewsList';

const HomePage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [showSplash, setShowSplash] = useState(true); // State untuk mengontrol tampilan splash screen

    useEffect(() => {
        // Simulasikan delay selama 2 detik sebelum menampilkan konten utama
        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 2000);

        // Bersihkan timeout saat komponen unmount
        return () => clearTimeout(timer);
    }, []);

    // Data dummy untuk slider
    const sliderImages = [
        '/images/slider1.png',
        '/images/slider2.png',
        '/images/slider3.png',
    ];

    // Data dummy untuk Sarat images
    const saratImages = [
        '/images/submit_nusa.png',
        '/images/history_nusa.png',
    ];

    // Settings untuk slider
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
                                <div className="mt-12 flex flex-wrap justify-around rounded-3xl">
                                    {/* Card 1 - Submit Sarat */}
                                    <Link href={user ? "/SubmitSarat" : "/Login"}>
                                        <div className="w-full sm:w-34 bg-white shadow-md rounded-md overflow-hidden mb-4 relative flex flex-col">
                                            <div className="relative h-36 w-full">
                                                <Image
                                                    src={saratImages[0]}
                                                    alt="History Ilustrator"
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-t-md"
                                                />
                                            </div>
                                            <div className="p-7 mt-2 bg-red-800 text-white rounded-tl-3xl rounded-tr-3xl flex items-left justify-between">
                                                <h2 className="text-sm font-semibold mb-6">
                                                    Submit Sarat
                                                </h2>
                                                <FontAwesomeIcon icon={faArrowRight} className="ml-1" style={{ width: '15px', height: '15px' }} />
                                            </div>
                                        </div>
                                    </Link>
                                    {/* Card 2 - History Sarat */}
                                    <Link href={user ? "/HistorySarat" : "/Login"}>
                                        <div className="w-full sm:w-34 bg-white shadow-md rounded-md overflow-hidden mb-4 relative flex flex-col">
                                            <div className="relative h-36 w-full">
                                                <Image
                                                    src={saratImages[1]}
                                                    alt="History Ilustrator"
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded-t-md"
                                                />
                                            </div>
                                            <div className="p-7 mt-2 bg-red-800 text-white rounded-tl-3xl rounded-tr-3xl flex items-left justify-between">
                                                <h2 className="text-sm font-semibold mb-6">
                                                    History Sarat
                                                </h2>
                                                <FontAwesomeIcon icon={faArrowRight} className="ml-1" style={{ width: '15px', height: '15px' }} />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="w-full mt-8 mb-4 bg-gray-200 h-0.5 rounded-sm"></div>
                                <div className=' flex-wrap justify-around ml-3'>
                                    <h1 className="text-2xl font-semibold mb-2">News</h1>
                                </div>
                                <div className='mb-28'>
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
