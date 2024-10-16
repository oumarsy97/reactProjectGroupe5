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

const SewingNetwork = () => {
    const { getToken } = useToken();
    const { actor } = useActor();
    const [activeFilter, setActiveFilter] = useState('tous');

    const crudPosts = useCrud(actor ? 'posts/others' : 'posts');
    const crudProduits = useCrud(actor ? 'produits/others' : 'produits');

    const { data: posts, isLoading: isLoadingPosts, isError: isErrorPosts } = useQuery('posts', () => crudPosts.get(), {
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });

    const { data: produits, isLoading: isLoadingProduits, isError: isErrorProduits } = useQuery('produits', () => crudProduits.get(), {
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });

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
        if (!posts || !produits) return [];
        const allItems = [
            ...posts.map(post => ({ ...post, type: 'post' })),
            ...produits.map(produit => ({ ...produit, type: 'produit' }))
        ];
        return shuffleAndFilterItems(allItems);
    }, [posts, produits, shuffleAndFilterItems]);

    const isLoading = isLoadingPosts || isLoadingProduits;
    const isError = isErrorPosts || isErrorProduits;

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
                        <p>Une erreur est survenue lors du chargement des éléments.</p>
                    ) : (
                        combinedItems.map(item => (
                            item.type ==='post' ? (
                                <SewingPost  post={item} />
                            ) : (
                                <SwingProduit  produit={item} />
                            )
                        ))
                    )}
                </div>
                <SidebarRight />
            </div>
        </div>
    );
};

export default SewingNetwork;