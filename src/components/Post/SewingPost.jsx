import React, { useRef, useEffect, useState } from 'react';
import { Heart, Share2, Bookmark, UserPlus, UserCheck } from 'lucide-react';
import { getTimeDifference } from "../../utils/tokenUtils";
import useCrud from "../../hooks/useCrudAxios";
import { useAuth } from "../../context/AuthContext";
import AlertService from "../../services/notifications/AlertService";
import CommentSystemDemo from "./PostCommentpopup";

const PostSwing = ({ post }) => {
    const {
        id,
        title,
        description,
        createdAt,
        photo,
        user,
        comments,
        tags
    } = post;
    const { user: currentUser } = useAuth();

    const [likes, setLikes] = useState(post.likes);
    const videoRef = useRef(null);
    const [isLiked, setIsLiked] = useState(likes.some(like => like.idUser === currentUser.id));
    const [likeCount, setLikeCount] = useState(likes.length);
    const { create: createLike } = useCrud(`posts/like/${id}`);
    const { create: toggleFollow } = useCrud(`follows/follow/${user.id}`);


    const [isFollowing, setIsFollowing] = useState(currentUser.follow.some( fol => fol.idActor === id)); // You might want to initialize this based on actual follow status

    useEffect(() => {

            setIsFollowing(currentUser.follow.some(fol => fol.idActor === id));

    }, [currentUser, isFollowing]);



    const isVideo = (url) => {
        return url.includes('/video/upload/');
    };

    const handleLikeClick = async () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);

        const data = await createLike([], true);

        if (data) {
            setLikes(prevLikes => [...prevLikes, data]);
            setLikeCount(prevCount => prevCount + 1);
        } else {
            setLikes(prevLikes => prevLikes.filter(like => like.idUser !== currentUser.id));
            setLikeCount(prevCount => prevCount - 1);
        }
    };

    const handleFollowClick = async () => {
        const newIsFollowing = !isFollowing;
        setIsFollowing(newIsFollowing);
        try {
            await toggleFollow([], true);
            // You might want to update the user object or trigger a re-fetch of user data here
            AlertService.success(newIsFollowing ? "Vous suivez maintenant cet utilisateur" : "Vous ne suivez plus cet utilisateur");
        } catch (error) {
            console.error("Error toggling follow status:", error);
            setIsFollowing(!newIsFollowing); // Revert the state if the API call fails
            await AlertService.error("Une erreur est survenue. Veuillez réessayer.");
        }
    };


    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.defaultMuted = false;
        }
    }, []);

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-0.5">
                            <div className="h-full w-full rounded-full relative overflow-hidden bg-white">
                                <img src={user.user.photo} alt="Profile" className="rounded-full" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="font-medium">{`${user.user.firstname} ${user.user.lastname}`}</h3>
                            <p className="text-gray-500 text-sm">{getTimeDifference(createdAt)}</p>
                        </div>
                    </div>
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
                </div>
                <p className="font-bold mt-2">{title}</p>
                <p className="mt-4">{description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {photo && (
                <div className="media-container">
                    {isVideo(photo) ? (
                        <video
                            ref={videoRef}
                            controls
                            className="w-full"
                            playsInline
                            preload="metadata"
                            muted={false}
                        >
                            <source src={photo} type="video/mp4" />
                            Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                    ) : (
                        <img src={photo} alt="Post" className="w-full" />
                    )}
                </div>
            )}

            <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                    <button
                        className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
                        onClick={handleLikeClick}
                    >
                        <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"}/>
                        <span>{likeCount}</span>
                    </button>
                    <button className="flex items-center hover:text-rose-500 transition-colors">
                        <CommentSystemDemo comment={comments} id={id} />
                        <span>{comments.length}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Share2 className="h-5 w-5"/>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Bookmark className="h-5 w-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostSwing;