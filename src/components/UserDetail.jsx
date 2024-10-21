import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, Briefcase, Star, Heart, MessageCircle, Scissors } from 'lucide-react';
import Navbar from "./UserProfile/Navbar";
import useCrud from "../hooks/useCrudAxios";
import { getTimeDifference } from "../utils/tokenUtils";
import { motion } from "framer-motion";

const UserDetail = () => {
    const { id } = useParams();
    const { get: getProfile } = useCrud('users/' + id);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getProfile();
            setUser(data);
            if (data.actor && data.actor[0]) {
                setPosts(data.actor[0].posts);
            }
        };

        fetchUser();
    }, [id, getProfile]);

    if (!user) return <div className="flex justify-center items-center h-screen font-sans text-[#003366]">Chargement...</div>;

    return (
        <div className="bg-white min-h-screen font-sans">
            <Navbar />
            <div className="max-w-4xl mx-auto p-4 sm:p-20 pt-20 pb-24">
                <motion.div
                    className="bg-[#f0f8ff] rounded-lg shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-gradient-to-b from-[#003366] to-[#0077be] p-4">
                        <div className="flex flex-col items-center mb-4">
                            <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center mb-3">
                                {user.photo ? (
                                    <img src={user.photo} alt={user.firstname} className="w-full h-full object-cover" />
                                ) : (
                                    <Scissors className="w-12 h-12 text-[#003366]" />
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-white text-center">{`${user.firstname} ${user.lastname}`}</h1>
                            <p className="text-[#e6f3ff] font-semibold">{user.role}</p>
                        </div>
                        <div className="text-[#e6f3ff] text-sm text-center mb-4 sm:grid grid-cols-3 gap-4 sm:grid-rows-3">
                            <InfoItem icon={MapPin} text={user.actor?.[0]?.address} />
                            <InfoItem icon={Calendar} text={getTimeDifference(user.createdAt)} />
                            <InfoItem icon={Briefcase} text={`${user.actor?.[0]?.posts?.length || 0} publications`} />
                        </div>

                        <p className="text-[#e6f3ff] text-sm text-center mb-4">{user.actor?.[0]?.bio}</p>
                    </div>

                    <div className="p-4">
                        <div className="flex justify-between">
                            <StatCard title="Abonnés" value={user.actor?.[0]?.follow?.length || 0} />
                            <StatCard title="Abonnements" value={user.actor?.[0]?.follow?.length || 0} />
                            <StatCard title="Avis" value={user.rating || 0} totalReviews={user.totalReviews || 0} isRating />
                        </div>
                    </div>
                </motion.div>

                {user.role !== "USER" && (
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <h2 className="text-xl font-bold text-[#003366] mb-4">Publications</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {posts.map((post, index) => (
                                <PostCard key={post.id} post={post} index={index} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, totalReviews, isRating }) => (
    <div className="text-center">
        <div className="font-bold text-xl text-[#003366] flex items-center justify-center">
            {isRating && <Star className="w-4 h-4 text-[#ffd700] mr-1" />}
            {value}
        </div>
        <div className="text-[#0077be] text-xs">{title}</div>
        {isRating && totalReviews && <div className="text-[#0077be] text-xs">{totalReviews} avis</div>}
    </div>
);

const InfoItem = ({ icon: Icon, text }) => (
    <div className="flex items-center justify-center mb-2">
        <Icon className="w-4 h-4 mr-2" />
        {text}
    </div>
);

const PostCard = ({ post, index }) => (
    <motion.div
        className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-[#e6f3ff]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
    >
        <img
            src={post.photo}
            alt={`Post ${post.id}`}
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/70 via-[#003366]/30 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                <div className="flex justify-center space-x-4">
                    <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" fill="#ffffff" />
                        {post.likes.length}
                    </div>
                    <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" stroke="#ffffff" />
                        {post.comments.length}
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

export default UserDetail;