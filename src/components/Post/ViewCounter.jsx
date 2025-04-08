import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Eye } from 'lucide-react'; // Importer l'icône Eye

const API_URL = process.env.REACT_APP_API_URL;

const ViewCounter = ({ postId }) => {
    const [viewCount, setViewCount] = useState(0);
    const [hasViewed, setHasViewed] = useState(false);

    const incrementViews = useCallback(async () => {
        if (hasViewed || !postId) {
            console.log('View already counted or no postId');
            return;
        }
        console.log('Attempting to increment views for post:', postId);
        try {
            const response = await axios.get(`${API_URL}/posts/${postId}/view`);
            console.log('API response:', response);
            if (response.status === 200) {
                setViewCount(prevCount => {
                    console.log('Updating view count from', prevCount, 'to', prevCount + 1);
                    return prevCount + 1;
                });
                setHasViewed(true);
            }
        } catch (error) {
            console.error("Error incrementing views:", error);
        }
    }, [postId, hasViewed]);

    useEffect(() => {
        incrementViews();
    }, [incrementViews]);

    return (
        <div className="flex items-center space-x-2 text-gray-500">
            <Eye className="h-5 w-5" />
            <span>{viewCount}</span>
        </div>
    );
};

export default ViewCounter;
