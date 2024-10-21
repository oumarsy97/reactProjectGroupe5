import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import Navbar from "./UserProfile/Navbar";
import SidebarLeft from "./sideBar/SidebarLeft";
import SewingPost from "./Post/SewingPost";
import SidebarTop from "./sideBar/SidebarTop";
import SidebarRight from "./sideBar/SidebarRight";
import useCrud from "../hooks/useCrudAxios";
import { useActor } from "../context/ActorContext";
import SwingProduit from "./Produits/SwingProduit";
import SewingRepost from './Post/SewingRepost';

const SewingNetwork = () => {
    const { actor } = useActor();
    const [activeFilter, setActiveFilter] = useState('tous');

    const crudPosts = useCrud(actor ? 'posts/others' : 'posts');
    const crudProduits = useCrud(actor ? 'produits/others' : 'produits');
    const crudReposts = useCrud('reposts/Allreposts');


    const { data: posts, isLoading: isLoadingPosts, isError: isErrorPosts, error: errorPosts } = useQuery('posts', () => crudPosts.get(), {
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });
    const { data: produits, isLoading: isLoadingProduits, isError: isErrorProduits, error: errorProduits } = useQuery('produits', () => crudProduits.get(), {
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });

    const { data: reposts } = useQuery('reposts', () => crudReposts.get(), {
        staleTime: 60000,
        refetchOnWindowFocus: false,
    });

    const filterItems = useCallback((items) => {
        if (!items) return [];
        return items.filter(item => {
            const itemDate = new Date(item.createdAt);
            const now = new Date();
            const diffHours = (now - itemDate) / (1000 * 60 * 60);

            switch (activeFilter) {
                case 'tous':
                    return true;
                case 'posts':
                    return item.type === 'post';
                case 'produits':
                    return item.type === 'produit';
                case 'reposts':
                    return item.type === 'repost';
                case 'tendances':
                    return item.likes && item.likes.length > 10;
                case 'recent':
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
        return allItems;
    }, [posts, produits, reposts]);

    const filteredItems = useMemo(() => filterItems(combinedItems), [combinedItems, filterItems]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="grid grid-cols-12 gap-4 lg:gap-12 pt-24 max-w-7xl mx-auto px-4 bottom-10 lg:bottom-5">
                <div className="hidden lg:block lg:col-span-3">
                    <SidebarLeft />
                </div>
                <div className="col-span-12 lg:col-span-9 xl:col-span-6 space-y-6 xl:mb-5 mb-16">
                    <SidebarTop activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => {
                            switch (item.type) {
                                case 'post':
                                    return <SewingPost post={item} key={item.id} />;
                                case 'produit':
                                    return <SwingProduit produit={item} key={item.id} />;
                                case 'repost':
                                    return <SewingRepost repost={item} key={item.id} />;
                                default:
                                    return null;
                            }
                        })
                    ) : (
                        <p>Aucun élément trouvé pour ce filtre.</p>
                    )}
                </div>
                <div className="lg:block lg:col-span-3">
                    <div className="sticky top-0">
                        <SidebarRight />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SewingNetwork;
