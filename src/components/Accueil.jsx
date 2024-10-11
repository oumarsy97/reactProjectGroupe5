import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import Navbar from "./UserProfile/Navbar";
import SidebarLeft from "./sideBar/SidebarLeft";
import SewingPost from "./Post/SewingPost";
import SidebarTop from "./sideBar/SidebarTop";
import SidebarRight from "./sideBar/SidebarRight";
import { getTimeDifference } from "../utils/tokenUtils";
import useCrud from "../hooks/useCrudAxios";
import {useToken} from "../context/TokenContext";
import  {useActor} from "../context/ActorContext";

const SewingNetwork = () => {
    const { getToken } = useToken();
    const {actor} = useActor();    const [activeFilter, setActiveFilter] = useState('tous');
    const crudPosts = useCrud('posts/others')
    const crudPostsAll = useCrud('posts');

    const crudProduits = useCrud('produits/others');
    const crudProduitsAll = useCrud('produits');






    const { data: posts, isLoading, isError } = useQuery('posts', () => crudPosts.get(), {
        staleTime: 60000, // 1 minute
        refetchOnWindowFocus: false,
    });

    const shuffleAndFilterPosts = useCallback((posts) => {
        console.log( posts)
        if (!posts) return [];
        const shuffledPosts = [...posts].sort(() => Math.random() - 0.5);
        return shuffledPosts.filter(post => {
            switch(activeFilter) {
                case 'tendances':
                    return post.likes.length > 10;
                case 'recent':
                    const postDate = new Date(post.createdAt);
                    const now = new Date();
                    const diffHours = (now - postDate) / (1000 * 60 * 60);
                    return diffHours < 24;
                default:
                    return true;
            }
        });
    }, [activeFilter]);

    const filteredPosts = shuffleAndFilterPosts(posts);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="grid grid-cols-12 gap-12 pt-24 max-w-7xl mx-auto px-4">
                <SidebarLeft />
                <div className="col-span-6 space-y-6">
                    <SidebarTop activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    {isLoading ? (
                        <p>Chargement des posts...</p>
                    ) : isError ? (
                        <p>Une erreur est survenue lors du chargement des posts.</p>
                    ) : (
                        filteredPosts.map(post => (
                            <SewingPost
                               post={post}
                            />
                        ))
                    )}
                </div>
                <SidebarRight />
            </div>
        </div>
    );
};

export default SewingNetwork;