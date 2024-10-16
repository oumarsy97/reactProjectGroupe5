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
        <div className="bg-white min-h-screen mt-4 font-sans">
            <Navbar />
            <div className="max-w-4xl mx-auto p-6 pt-16">
                <motion.div
                    className="bg-[#f0f8ff] rounded-lg shadow-lg overflow-hidden border-t-4 border-[#003366]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="h-48 bg-gradient-to-b from-[#003366] to-[#0077be]">
                        <div className="grid grid-cols-3 gap-6 p-6">
                            <StatCard title="Abonnés" value={user.actor?.[0]?.follow?.length || 0} />
                            <StatCard title="Abonnements" value={user.actor?.[0]?.follow?.length || 0} />
                            <StatCard title="Avis" value={user.rating || 0} totalReviews={user.totalReviews || 0} isRating />
                        </div>
                    </div>

                    <div className="relative px-6 py-4">
                        <div className="absolute -top-16 left-6 w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center">
                            {user.photo ? (
                                <img src={user.photo} alt={user.firstname} className="w-full h-full object-cover" />
                            ) : (
                                <Scissors className="w-16 h-16 text-[#003366]" />
                            )}
                        </div>
                        <div className="ml-40 mb-4">
                            <h1 className="text-3xl font-bold text-[#003366]">{`${user.firstname} ${user.lastname}`}</h1>
                            <p className="text-[#0077be] font-semibold">{user.role}</p>
                        </div>
                        <p className="mt-4 text-[#333333]">{user.actor?.[0]?.bio}</p>
                        <div className="mt-4 flex flex-wrap gap-4">
                            <InfoItem icon={MapPin} text={user.actor?.[0]?.address} />
                            <InfoItem icon={Calendar} text={getTimeDifference(user.createdAt)} />
                            <InfoItem icon={Briefcase} text={`${user.actor?.[0]?.posts?.length || 0} publications`} />
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
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Publications</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
    <motion.div
        className="bg-white p-4 rounded-xl text-center hover:bg-[#e6f3ff] transition-colors cursor-pointer shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <div className="font-bold text-2xl text-[#003366] flex items-center justify-center">
            {isRating && <Star className="w-5 h-5 text-[#ffd700] mr-1" />}
            {value}
        </div>
        <div className="text-[#0077be] text-sm">{title}</div>
        {isRating && totalReviews && <div className="text-[#0077be] text-xs">{totalReviews} avis</div>}
    </motion.div>
);

const InfoItem = ({ icon: Icon, text }) => (
    <div className="flex items-center text-[#333333]">
        <Icon className="w-5 h-5 mr-2 text-[#0077be]" />
        {text}
    </div>
);

const PostCard = ({ post, index }) => (
    <motion.div
        className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-[#e6f3ff]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
    >
        <img
            src={post.photo}
            alt={`Post ${post.id}`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/70 via-[#003366]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex justify-center space-x-6">
                    <div className="flex items-center">
                        <Heart className="w-5 h-5 mr-2" fill="#ffffff" />
                        {post.likes.length}
                    </div>
                    <div className="flex items-center">
                        <MessageCircle className="w-5 h-5 mr-2" stroke="#ffffff" />
                        {post.comments.length}
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

export default UserDetail;