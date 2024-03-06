// pages/news/[id].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactPlayer from 'react-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const NewsDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [newsDetail, setNewsDetail] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const apiUrl = `https://api.nusa-sarat.nuncorp.id/api/v1/news/fetch/${id}`;

                const response = await fetch(apiUrl, {
                    method: 'GET',
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setNewsDetail(responseData.body);
                } else {
                    console.error('API Error:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching news detail:', error);
            }
        };

        if (id) {
            fetchNewsDetail();
        }
    }, [id]);

    if (!newsDetail) {
        return <p>Loading...</p>;
    }

    return (
        <div className="max-w-screen-md min-h-screen mx-auto p-4">
            <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                <FontAwesomeIcon icon={faArrowLeft} style={{ width: '20px', height: '20px' }} onClick={() => router.back()} />
                <h2 className="text-lg font-semibold text-center">Detail Berita</h2>
                <div className="w-6" />
            </div>
            <ReactPlayer
                url={newsDetail.video_url}
                controls
                width="100%"
                height="300px"
                style={{ marginBottom: '16px' }}
            />
            <p className="mb-6">{newsDetail.description}</p>
            <a href={newsDetail.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-block mb-6">
                Watch Video on YouTube
            </a>
            <p className="text-gray-600 mb-2">{newsDetail.createdAt}</p>
        </div>
    );
};

export default NewsDetail;
