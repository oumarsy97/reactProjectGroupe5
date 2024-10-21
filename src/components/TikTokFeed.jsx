import React from 'react';
import { useQuery } from 'react-query';
import useCrud from "../hooks/useCrudAxios";
import SwingPost from './Post/SwingPost'; // Import the new SwingPost component

const TikTokFeed = () => {
    const crudPosts = useCrud('posts'); // Adjust the endpoint if necessary
    const { data: posts } = useQuery('posts', () => crudPosts.get(), {
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });

    return (
        <div className="min-h-screen bg-gray-100 overflow-y-scroll">
            <div className="flex flex-col items-center">
                {posts && posts.length > 0 ? (
                    posts.map(post => (
                        <SwingPost post={post} key={post.id} />
                    ))
                ) : (
                    <p>Aucun post trouvé.</p>
                )}
            </div>
        </div>
    );
};

export default TikTokFeed;
