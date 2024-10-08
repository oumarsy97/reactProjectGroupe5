import React, {useEffect, useState} from 'react';
import Navbar from "./UserProfile/Navbar";
import SidebarLeft from "./sideBar/SidebarLeft";
import SewingPost from "./Post/SewingPost";
import SidebarTop from "./sideBar/SidebarTop";
import SidebarRight from "./sideBar/SidebarRight";
import {fetchOthersPosts} from "../services/PostService";
import {getTimeDifference} from "../utils/tokenUtils";
const SewingNetwork = () => {
    const [activeFilter, setActiveFilter] = useState('tendances');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getPosts = async () => {
            try {
                const data = await fetchOthersPosts();
                const shuffledPosts = [...data].sort(() => Math.random() - 0.5);
                // Vous pouvez filtrer les posts ici en fonction de activeFilter si nécessaire
                const filteredPosts = shuffledPosts.filter(post => {
                    // Logique de filtrage selon activeFilter
                    return true; // À modifier selon vos besoins
                });
                console.log('Posts mélangés et filtrés :', filteredPosts);
                setPosts(filteredPosts);
            } catch (error) {
                console.error('Erreur lors de la récupération des posts :', error);
            }
        };
        getPosts();
    }, [activeFilter]); // L'effet s'exécutera à chaque changement de activeFilter




 return (
        <div className="min-h-screen bg-gray-100">
            <Navbar/>
            <div className="grid grid-cols-12 gap-12 pt-24 max-w-7xl mx-auto px-4">


                <SidebarLeft />


                <div className="col-span-6 space-y-6">
                    <SidebarTop activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    {/* Posts go here */}
                    {posts.map(post => (

                    <SewingPost

                        username={post.user.user.firstname+' '+  post.user.user.lastname }
                        timeAgo={"Il y a "+getTimeDifference(post.createdAt)}
                        content={post.description}
                        tags={['robe', 'vintage', 'couture']}
                        likes={post.likes.length}
                        comments={post.comments.length}
                        mediaUrl={post.photo}
                        mediaType="image"
                        mediaProfil={post.user.user.photo}
                    />
                        ))}











                </div>
               <SidebarRight />
            </div>
        </div>
    );
};

export default SewingNetwork;
