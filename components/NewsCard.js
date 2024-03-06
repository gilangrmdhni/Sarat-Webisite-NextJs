// components/NewsCard.js
import React from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const NewsCard = ({ id, title, imageUrl, description }) => {
    return (
        <div className="w-fullshadow-md rounded-md overflow-hidden mb-4 relative p-2">
            <div className="relative h-36 w-full">
                <Image
                    src={imageUrl}
                    alt={`News ${id}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-md"
                />
            </div>
            <div className="p-7 bg-red-800 text-white rounded-b-md ">
                <h2 className="text-sm font-semibold mb-2">
                    {title}
                </h2>
                <p className="text-xs text-gray-300">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default NewsCard;
