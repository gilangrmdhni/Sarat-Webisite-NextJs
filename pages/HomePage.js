// pages/HomePage.js
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
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NewsList from '@/components/NewsList';


const HomePage = () => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            // Jika belum login, tidak melakukan pengalihan ke halaman login
            // atau memberikan pemberitahuan kepada pengguna
            console.log("Pengguna belum login.");
        }
    }, [user]);



    const sliderImages = [
        '/images/slider1.png',
        '/images/slider2.png',
        '/images/slider3.png',
    ];

    const saratImages = [
        '/images/Attached files-rafiki (2).png',
        '/images/Stamp collecting-rafiki.png',
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };


    // Data dummy berita
    const dummyNewsData = [
        {
            id: 1,
            title: 'Lorem Ipsum Dolor Sit Amet',
            imageUrl: '/images/slider1.png',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla gravida, justo in commodo pellentesque, leo augue viverra libero.',
        },
        {
            id: 2,
            title: 'Sed Do Eiusmod Tempor Incididunt',
            imageUrl: '/images/slider2.png',
            description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        },
    ];
    return (
        <>
            <Navbar />
            <Layout>
                <div className='bg-white min-h-full items-center justify-center'>
                    <div className='pt-4'>
                        <Slider {...settings} className="px-4">
                            {sliderImages.map((image, index) => (
                                <div key={index} className="w-full h-22">
                                    <img
                                        src={image}
                                        alt={`Slider ${index + 1}`}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <div className="w-full mt-8 bg-gray-200 h-1 rounded-sm"></div>
                    <div className="mt-12 flex flex-wrap justify-around rounded-3xl">
                        {/* Card 1 - Submit Sarat */}
                        <Link href={user ? "/SubmitSarat" : "/Login"}>
                            <div className="w-full sm:w-48 bg-white shadow-md rounded-md overflow-hidden mb-4 relative flex flex-col">
                                <div className="relative h-36 w-full">
                                    <Image
                                        src={saratImages[0]}
                                        alt="History Ilustrator"
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-t-md"
                                    />
                                </div>
                                <div className="p-7  bg-red-800 text-white rounded-tl-3xl rounded-tr-3xl flex items-left justify-between">
                                    <h2 className="text-sm font-semibold mb-6">
                                        Submit Sarat
                                    </h2>
                                    <FontAwesomeIcon icon={faArrowRight} className="ml-1" style={{ width: '15px', height: '15px' }} />
                                </div>
                            </div>
                        </Link>

                        {/* Card 2 - History Sarat */}
                        <Link href={user ? "/HistorySarat" : "/Login"}>
                            <div className="w-full sm:w-48 bg-white shadow-md rounded-md overflow-hidden mb-4 relative flex flex-col">
                                <div className="relative h-36 w-full">
                                    <Image
                                        src={saratImages[1]}
                                        alt="History Ilustrator"
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-t-md"
                                    />
                                </div>
                                <div className="p-7  bg-red-800 text-white rounded-tl-3xl rounded-tr-3xl flex items-left justify-between">
                                    <h2 className="text-sm font-semibold mb-6">
                                        History Sarat
                                    </h2>
                                    <FontAwesomeIcon icon={faArrowRight} className="ml-1" style={{ width: '15px', height: '15px' }} />
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="w-full mt-4 bg-gray-200 h-1 rounded-sm"></div>
                    <div className=' flex-wrap justify-around ml-3'>
                        <h1 className="text-2xl font-semibold mb-2">News</h1>
                    </div>
                    {/* <div className='mb-32'>
                        {dummyNewsData.map((news) => (
                            <NewsCard key={news.id} {...news} />
                        ))}
                    </div> */}
                    <div className='mb-32'>
                        <NewsList />
                    </div>
                </div>
                <BottomBar />
            </Layout>

        </>
    );
};

export default HomePage;
