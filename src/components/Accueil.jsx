import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import Navbar from "./UserProfile/Navbar";
import SidebarLeft from "./sideBar/SidebarLeft";
import SewingPost from "./Post/SewingPost";
import SidebarTop from "./sideBar/SidebarTop";
import SidebarRight from "./sideBar/SidebarRight";
import useCrud from "../hooks/useCrudAxios";
import { useToken } from "../context/TokenContext";
import { useActor } from "../context/ActorContext";
import SwingProduit from "./Produits/SwingProduit";
import SewingRepost from './Post/SewingRepost';

const SewingNetwork = () => {
    const { getToken } = useToken();
    const { actor } = useActor();
    const [activeFilter, setActiveFilter] = useState('tous');

    const crudPosts = useCrud(actor ? 'posts/others' : 'posts');
    const crudProduits = useCrud(actor ? 'produits/others' : 'produits');
    const crudReposts = useCrud('reposts/Allreposts');
    

    const { data: posts, isLoading: isLoadingPosts, isError: isErrorPosts, error: errorPosts } = useQuery('posts', () => crudPosts.get(), {
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });

    const { data: produits, isLoading: isLoadingProduits, isError: isErrorProduits, error: errorProduits } = useQuery('produits', () => crudProduits.get(), {
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });

    const { data: reposts, isLoading: isLoadingReposts, isError: isErrorReposts, error: errorReposts } = useQuery('reposts', () => crudReposts.get(), {
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });

    console.log({ data: reposts, isLoading: isLoadingReposts, isError: isErrorReposts, error: errorReposts });
    
    const shuffleAndFilterItems = useCallback((items) => {
        if (!items) return [];
        const shuffledItems = [...items].sort(() => Math.random() - 0.5);
        return shuffledItems.filter(item => {
            switch(activeFilter) {
                case 'tendances':
                    return item.likes && item.likes.length > 10;
                case 'recent':
                    const itemDate = new Date(item.createdAt);
                    const now = new Date();
                    const diffHours = (now - itemDate) / (1000 * 60 * 60);
                    return diffHours < 24;
                default:
                    return true;
            }
        });
    }, [activeFilter]);

    const combinedItems = useMemo(() => {
        const allItems = [
            ...(posts || []).map(post => ({ ...post, type: 'post' })),
            ...(produits || []).map(produit => ({ ...produit, type: 'produit' })),
            ...(reposts || []).map(repost => ({ ...repost, type: 'repost' }))
        ];
        return shuffleAndFilterItems(allItems);
    }, [posts, produits, reposts, shuffleAndFilterItems]);

    const isLoading = isLoadingPosts || isLoadingProduits || isLoadingReposts;
    const isError = isErrorPosts || isErrorProduits || isErrorReposts;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="grid grid-cols-12 gap-12 pt-24 max-w-7xl mx-auto px-4">
                <SidebarLeft />
                <div className="col-span-6 space-y-6">
                    <SidebarTop activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    {isLoading ? (
                        <p>Chargement des éléments...</p>
                    ) : isError ? (
                        <div>
                            <p>Une erreur est survenue lors du chargement des éléments.</p>
                            {errorPosts && <p>Erreur des posts: {errorPosts.message}</p>}
                            {errorProduits && <p>Erreur des produits: {errorProduits.message}</p>}
                            {errorReposts && <p>Erreur des reposts: {errorReposts.message}</p>}
                        </div>
                    ) : (
                        combinedItems.map(item => (
                            item.type === 'post' ? (
                                <SewingPost post={item} key={item.id} />
                            ) : item.type === 'produit' ? (
                                <SwingProduit produit={item} key={item.id} />
                            ) : item.type === 'repost' ? (
                                <SewingRepost repost={item} key={item.id} />
                            ) : null
                        ))
                    )}
                </div>
                <SidebarRight />
            </div>
        </div>
    );
};

export default SewingNetwork;