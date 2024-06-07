// components/NewsList.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const NewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const [error, setError] = useState(null);
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
                    setError(`API Error: ${response.status} ${response.statusText}`);
                    console.error('API Error:', response.status, response.statusText);
                }
            } catch (error) {
                setError(`Error fetching news list: ${error.message}`);
                console.error('Error fetching news list:', error);
            }
        };

        fetchNewsList();
    }, []);

    const navigateToDetail = (id) => {
        router.push(`/news/${id}`);
    };

    const truncateDescription = (description) => {
        return description.length > 50 ? `${description.substring(0, 50)}...` : description;
    };

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            {newsList.map((news) => (
                <div key={news.id} className="mb-2">
                    <div className="max-w-md mx-auto bg-white rounded-md overflow-hidden shadow-md cursor-pointer" onClick={() => navigateToDetail(news.id)}>
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
            ))}
        </div>
    );
};

export default NewsList;
