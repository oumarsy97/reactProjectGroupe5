import React, { useRef, useEffect, useState } from 'react';
import { Heart, Share2, Bookmark, Trash2 } from 'lucide-react';
import { getTimeDifference } from "../../utils/tokenUtils";
import useCrud from "../../hooks/useCrudAxios";
import { useAuth } from "../../context/AuthContext";
import CommentSystemDemo from "./PostCommentpopup";
import FollowButton from "../FollowButton";
import RepostComponent from "./RepostComponent";
import ViewCounter from "./ViewCounter";

const SewingRepost = ({ repost }) => {
    const { user: currentUser } = useAuth();

    const targetPost = repost?.Post || repost?.post || repost;

    const [likes, setLikes] = useState(targetPost?.likes || []);
    const [viewCount, setViewCount] = useState(targetPost?.views || 0);
    const videoRef = useRef(null);
    const [isLiked, setIsLiked] = useState(likes.some(like => like.idUser === currentUser.id));
    const [likeCount, setLikeCount] = useState(likes.length);
    const { create: createLike, update: updateViews } = useCrud(`posts/${targetPost?.id}`);

    const isVideo = (url) => {
        return url && url.includes('/video/upload/');
    };

    const handleLikeClick = async () => {
        if (!targetPost?.id) return;

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const incrementViews = async () => {
        try {
            const updatedViews = await updateViews({ views: viewCount + 1 });
            if (updatedViews) {
                setViewCount(updatedViews.views);
            }
        } catch (error) {
            console.error("Error incrementing views:", error);
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.defaultMuted = false;
        }

        incrementViews();
    }, []);

    if (!targetPost) {
        return <div>Error: Post data is missing</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {repost?.user && (
                <div className="bg-gradient-to-b from-black to-purple-900 text-white px-4 py-3 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            <img src={repost.user.photo} alt="profile" className='w-10 h-10 rounded-full object-cover' />
                            <span className="text-sm font-bold">
                                Reposté par <span className="font-semibold">{repost.user.firstname} {repost.user.lastname}</span>
                            </span>
                        </div>
                        <button className="text-red-400 hover:text-red-300 transition duration-300">
                            <Trash2 size={20} />
                        </button>
                    </div>
                    {repost?.content && (
                        <p className="mt-2 text-gray-300 text-sm">{repost.content}</p>
                    )}
                </div>
            )}

            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-0.5">
                            <div className="h-full w-full rounded-full relative overflow-hidden bg-white">
                                <img src={targetPost.user?.photo || targetPost.user?.user?.photo} alt="Profile" className="rounded-full" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <h3 className="font-medium">{`${targetPost.user?.firstname || targetPost.user?.user?.firstname} ${targetPost.user?.lastname || targetPost.user?.user?.lastname}`}</h3>
                            <p className="text-gray-500 text-sm">{targetPost.createdAt && getTimeDifference(targetPost.createdAt)}</p>
                        </div>
                    </div>
                    {targetPost.user && (
                        <FollowButton
                            userId={targetPost.user.id}
                            initialIsFollowing={currentUser.follow.some(fol => fol.idActor === targetPost.user.id)}
                            currentUser={currentUser}
                        />
                    )}
                </div>

                <div className="mt-6">
                    {targetPost.title && <p className="font-bold mt-2">{targetPost.title}</p>}
                    {targetPost.description && <p className="mt-2">{targetPost.description}</p>}
                    {targetPost.tags && targetPost.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {targetPost.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {targetPost.photo && (
                <div className="media-container">
                    {isVideo(targetPost.photo) ? (
                        <video
                            ref={videoRef}
                            controls
                            className="w-full"
                            playsInline
                            preload="metadata"
                            muted={false}
                        >
                            <source src={targetPost.photo} type="video/mp4" />
                            Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                    ) : (
                        <img src={targetPost.photo} alt="Post" className="w-full rounded-lg" />
                    )}
                </div>
            )}

            <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                    <button
                        className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
                        onClick={handleLikeClick}
                    >
                        <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                        <span>{likeCount}</span>
                    </button>
                    <button className="flex items-center hover:text-rose-500 transition-colors">
                        <CommentSystemDemo comment={targetPost.comments || []} id={targetPost.id} />
                        <span>{targetPost.comments?.length || 0}</span>
                    </button>
                    <RepostComponent post={targetPost} repost={repost} />
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Share2 className="h-5 w-5" />
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Bookmark className="h-5 w-5" />
                    </button>
                    {/* Remplacer le code de compteur de vues par le composant ViewCounter */}
                    <ViewCounter viewCount={viewCount} />
                </div>
            </div>
        </div>
    );
};

export default SewingRepost;