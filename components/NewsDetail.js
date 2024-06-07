// components/NewsDetail.js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
        <div className='dark: text-black'>
            <h1 className="text-2xl font-semibold mb-2">{newsDetail.description}</h1>
            <p className="text-gray-600">{newsDetail.createdAt}</p>
            <p>{newsDetail.description}</p>
            <a href={newsDetail.video_url} target="_blank" rel="noopener noreferrer">
                Watch Video
            </a>
        </div>
    );
};

export default NewsDetail;
