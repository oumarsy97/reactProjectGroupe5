import React, { useState, useEffect } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';
import useCrud from "../hooks/useCrudAxios";
import AlertService from "../services/notifications/AlertService";

const FollowButton = ({ userId, initialIsFollowing, currentUser }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const { create: toggleFollow } = useCrud(`follows/follow/${userId}`);

    useEffect(() => {
        setIsFollowing(currentUser.follow.some(fol => fol.idActor === userId));
    }, [currentUser, userId]);

    const handleFollowClick = async () => {
        const newIsFollowing = !isFollowing;
        setIsFollowing(newIsFollowing);
        try {
            await toggleFollow([], true);
            AlertService.success(newIsFollowing ? "Vous suivez maintenant cet utilisateur" : "Vous ne suivez plus cet utilisateur");
        } catch (error) {
            console.error("Error toggling follow status:", error);
            setIsFollowing(!newIsFollowing);
            await AlertService.error("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    return (
        <button
            onClick={handleFollowClick}
            className={`flex items-center px-4 py-1 text-white text-sm font-medium rounded-full ${
                isFollowing
                    ? 'bg-gray-500 hover:bg-gray-600'
                    : 'bg-gradient-to-br from-black to-purple-900 hover:opacity-90'
            } transition-all duration-200`}
        >
            {isFollowing ? (
                <>
                    <UserCheck className="h-5 w-5 mr-1" />
                    <span>Suivi</span>
                </>
            ) : (
                <>
                    <UserPlus className="h-5 w-5 mr-1" />
                    <span>Suivre</span>
                </>
            )}
        </button>
    );
};

export default FollowButton;