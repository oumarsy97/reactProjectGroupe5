import React, { useState, useEffect } from 'react';
import { Layout, Users, Star } from 'lucide-react';
import ProfileCard from "../UserProfile/ProfilCard";
import StatsCard from "../UserProfile/StatsCard";
import { fetchmyposts } from "../../services/PostService";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {fetmyfollowings, myfollowers} from "../../services/userService";  // Importer le contexte d'authentification

const SidebarLeft = () => {
    const { user } = useAuth();  // Récupérer les infos de l'utilisateur connecté
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const [followers, setFollowers] = useState([]);
    const [fetFollowingsData, setFetFollowingsData] = useState([]);

    useEffect(() => {
        const fetchMypost = async () => {
            try {
                const postData = await fetchmyposts();
                setPosts(postData);
            } catch (error) {
                console.error('Erreur lors de la récupération des posts de l\'acteur :', error);
            }
        };
        const fetchFollowers = async () => {
            try {
                const followersData = await myfollowers();
                setFollowers(followersData);
            } catch (error) {
                console.error('Erreur lors de la récupération des followers :', error);
            }
        }
        const fetmyFollowings = async () => {
            try {
                const fetFollowingsData = await fetmyfollowings();
                console.log(fetFollowingsData);
                setFetFollowingsData(fetFollowingsData);
            } catch (error) {
                console.error('Erreur lors de la récupération des followers :', error);
            }
        }
        if (user?.role === 'TAILOR') {  // Ne récupérer les posts que si le rôle est TAILOR
            fetchMypost();
        }
        if (user?.role === 'TAILOR' || user?.role === 'VENDOR') {  // Ne récupérer les posts que si le rôle est TAILOR
            fetchFollowers();
        }
        fetmyFollowings();
    }, [user]);

    return (
        <div className="col-span-3 ">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <ProfileCard name="Marie Couture" specialty="Créatrice Passionnée" />
                <div className="space-y-4">
                    <StatsCard icon={<Users />} title="Abonnés" value={followers.length} />
                    <StatsCard icon={<Users />} title="suivi(e)s" value={fetFollowingsData.length} />

                    {/* Afficher les réalisations uniquement si l'utilisateur est un TAILOR */}
                    {user?.role === 'TAILOR' && (
                        <StatsCard icon={<Layout />} title="Mes Créations" value={posts.length || "0"} />
                    )}
                </div>
                <button className="w-full mt-6 bg-gradient-to-r mb-3 from-rose-400 to-purple-400 text-white py-2 px-4 rounded-full" onClick={()=>{ navigate("/profile")}}>
                    Voir mon profil
                </button>
            </div>
        </div>
    );
};

export default SidebarLeft;
