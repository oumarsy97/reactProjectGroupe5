import React from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import SewingPost from "./SewingPost";
import useCrud from "../../hooks/useCrudAxios";
import { getTimeDifference } from '../../utils/tokenUtils';
import AlertService from '../../services/notifications/AlertService';

const SewingRepost = ({ repost, onDelete }) => {
    const { user: currentUser } = useAuth();
    const targetPost = repost?.Post || repost?.post || repost;
    const { delete: deleteRepost } = useCrud(`reposts/${repost.id}`);

    const handleDeleteRepost = async () => {
        try {
            await deleteRepost();
            onDelete(repost.id);
            AlertService.success("Repost deleted successfully");
        } catch (error) {
            console.error("Error deleting repost:", error);
            AlertService.error("Failed to delete repost");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {repost?.user && (
                <div className="bg-gradient-to-b from-black to-purple-900 text-white px-4 py-3 rounded-t-xl">
                <div className="flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            <img src={repost.user.photo} alt="profile" className='w-10 h-10 rounded-full object-cover' />
                            <span className="text-sm font-bold">
                                Reposté par <span className="font-semibold">{repost.user.firstname} {repost.user.lastname}
                                <p className="text-gray-500 text-sm">{getTimeDifference(repost?.createdAt || targetPost?.createdAt)}</p>
                                </span>
                            </span>
                        </div>
                        {currentUser.id === repost.user.id && (
                            <button className="text-red-400 hover:text-red-300 transition duration-300" onClick={handleDeleteRepost}>
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                    {repost?.content && (
                        <p className="mt-2 text-gray-300 text-sm">{repost.content}</p>
                    )}
                </div>
            )}
            <SewingPost post={targetPost}/>
        </div>
    );
};

export default SewingRepost;
