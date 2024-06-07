// components/NewsList.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


const NewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch news list from the API
        const fetchNewsList = async () => {
            try {
                const apiUrl = 'https://api.nusa-sarat.nuncorp.id/api/v1/news/filter';

                const response = await fetch(apiUrl, {
                    method: 'GET',
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setNewsList(responseData.body); // Assuming the response contains an array of news objects
                } else {
                    console.error('API Error:', response.status, response.statusText);
                    // Handle API error scenario
                }
            } catch (error) {
                console.error('Error fetching news list:', error);
                // Handle other errors
            }
        };


        fetchNewsList();
    }, []);
    const navigateToDetail = (id) => {
        router.push(`/news/${id}`);
    };
    const truncateDescription = (description) => {
        // Ambil 15 karakter pertama dan tambahkan titik-titik jika lebih dari itu
        return description.length > 50 ? description.substring(0, 50) + '...' : description;
    };

    return (
        <div>
            {newsList.map((news) => (
                <div key={news.id} className="mb-2">
                    <div key={news.id} className="mb-2" onClick={() => navigateToDetail(news.id)}>
                        <div className="max-w-md mx-auto bg-white rounded-md overflow-hidden shadow-md cursor-pointer">
                            <img
                                src={`https://api.nusa-sarat.nuncorp.id/storage${news.thumbnail}`}
                                alt={news.title}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-2">
                                <h2 className="text-lg font-semibold mb-2">{news.title}</h2>
                                <p className="text-gray-600 mb-4">{truncateDescription(news.description)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NewsList;