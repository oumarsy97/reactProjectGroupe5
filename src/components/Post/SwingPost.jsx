import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Heart, Share2, Bookmark, UserPlus, UserCheck, MessageCircle, Eye, MoreVertical, Flag } from 'lucide-react';
import { getTimeDifference } from "../../utils/tokenUtils";
import useCrud from "../../hooks/useCrudAxios";
import { useAuth } from "../../context/AuthContext";
import AlertService from "../../services/notifications/AlertService";
import Comments from './PostCommentpopup';
import RepostComponent from "./RepostComponent";
import StarRating from "./Note";
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const PostSwing = ({ post }) => {
    const {
        id,
        title,
        description,
        createdAt,
        photo,
        user,
        comments: initialComments,
        tags,
        vues = 0
    } = post;
    const { user: currentUser } = useAuth();

    const [likes, setLikes] = useState(post.likes);
    const videoRef = useRef(null);
    const [hasViewed, setHasViewed] = useState(false);
    const postRef = useRef(null);
    const [viewCount, setViewCount] = useState(vues);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(likes.some(like => like.idUser === currentUser.id));
    const [likeCount, setLikeCount] = useState(likes.length);
    const { create: createLike } = useCrud(`posts/like/${id}`);
    const { create: toggleFollow } = useCrud(`follows/follow/${user.id}`);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const { create: createComment } = useCrud(`posts/comment/${id}`);
    const crudComment = useCrud(`posts/comment/${id}`);

    const [isFollowing, setIsFollowing] = useState(currentUser.follow.some(fol => fol.idActor === id));
    const [isFavorited, setIsFavorited] = useState(post.favoris ? post.favoris.some(fav => fav.idUser === currentUser.id) : false);
    const { create: createFavorite } = useCrud(`posts/favoris/${id}`);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const rawData = await crudComment.get();
                const formattedComments = rawData.map(comment => ({
                    id: comment.id,
                    userName: comment.author.id === currentUser.id
                        ? "Vous"
                        : `${comment.author.firstname} ${comment.author.lastname}`,
                    userImage: comment.author.photo,
                    content: comment.content,
                    timestamp: getTimeDifference(comment.createdAt),
                    likes: comment.likes,
                    isLiked: comment.isLikedByCurrentUser,
                    replies: []
                }));
                setComments(formattedComments);
            } catch (error) {
                console.error("Erreur lors de la récupération des commentaires:", error);
            }
        };
        if (showComments) {
            fetchComments();
        }
    }, [showComments]);

    useEffect(() => {
        setIsFollowing(currentUser.follow.some(fol => fol.idActor === id));
    }, [currentUser, isFollowing, id]);

    const isVideo = (url) => {
        return url.includes('/video/upload/');
    };

    const handleLikeClick = async () => {
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);

        try {
            const data = await createLike([], true);

            if (data) {
                setLikes(prevLikes => [...prevLikes, data]);
                setLikeCount(prevCount => prevCount + 1);
            } else {
                setLikes(prevLikes => prevLikes.filter(like => like.idUser !== currentUser.id));
                setLikeCount(prevCount => prevCount - 1);
            }
        } catch (error) {
            console.error("Error toggling like status:", error);
            setIsLiked(!newIsLiked); // Revert the like status
            if (error.response && error.response.status === 404) {
                AlertService.error("Le post n'a pas été trouvé. Il a peut-être été supprimé.");
            } else {
                AlertService.error("Une erreur est survenue lors de la mise à jour du like. Veuillez réessayer.");
            }
        }
    };

    const handleFavorisClick = async () => {
        const newIsFavorited = !isFavorited;
        setIsFavorited(newIsFavorited);

        try {
            await createFavorite([], true);
            AlertService.success(newIsFavorited ? "Post ajouté aux favoris" : "Post retiré des favoris");
        } catch (error) {
            console.error("Erreur lors de la mise à jour des favoris:", error);
            setIsFavorited(!newIsFavorited);
            AlertService.error("Une erreur est survenue. Veuillez réessayer.");
        }
    };

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

    const handleAddComment = async (newCommentText) => {
        try {
            const response = await createComment({ content: newCommentText });
            const newCommentObject = {
                id: response.id,
                userName: 'Vous',
                userImage: currentUser.photo,
                content: newCommentText,
                timestamp: 'À l\'instant',
                likes: 0,
                isLiked: false,
                replies: []
            };
            setComments(prevComments => [newCommentObject, ...prevComments]);
        } catch (error) {
            console.error("Erreur lors de la création du commentaire:", error);
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.defaultMuted = false;
        }
    }, []);

    const incrementViews = useCallback(async () => {
        if (hasViewed || !id) return;

        try {
            const response = await axios.get(`${API_URL}/posts/${id}/view`);
            if (response.status === 200) {
                setViewCount(prevCount => prevCount + 1);
                setHasViewed(true);
            }
        } catch (error) {
            console.error("Error incrementing views:", error);
        }
    }, [id, hasViewed]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasViewed) {
                    incrementViews();
                }
            },
            { threshold: 0.5 }
        );

        if (postRef.current) {
            observer.observe(postRef.current);
        }

        return () => {
            if (postRef.current) {
                observer.unobserve(postRef.current);
            }
        };
    }, [incrementViews, hasViewed]);

    return (
        <div ref={postRef} className="bg-white rounded-xl shadow-sm overflow-hidden h-screen flex flex-col">
            <div className="p-4 flex-grow">
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
                        className={`flex items-center px-4 py-1 text-white text-sm font-medium rounded-full ${isFollowing
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
                <StarRating idPost={id} idUser={currentUser.id} />
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
                <div className="flex justify-center items-center bg-gray-100 flex-grow">
                    {isVideo(photo) ? (
                        <video
                            ref={videoRef}
                            controls
                            className="w-full h-full object-cover"
                            playsInline
                            preload="metadata"
                            muted
                        >
                            <source src={photo} type="video/mp4" />
                            Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                    ) : (
                        <img src={photo} alt="Post" className="w-full h-full object-cover" />
                    )}
                </div>
            )}

            <div className="p-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                    <button
                        className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
                        onClick={handleLikeClick}
                    >
                        <Heart className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} />
                        <span>{likeCount}</span>
                    </button>
                    <button
                        className={`flex items-center space-x-2 transition-colors hover:text-rose-500 ${showComments ? 'text-rose-500' : ''}`}
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageCircle className="h-5 w-5" />
                        <span>{comments.length || initialComments.length}</span>
                    </button>
                    <RepostComponent post={post} />
                    <div className="flex items-center space-x-2 text-gray-500">
                        <Eye className="h-5 w-5" />
                        <span>{viewCount}</span>
                    </div>
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 hover:text-rose-500 transition-colors"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <MoreVertical className="h-6 w-6" />
                        </button>

                        {/* Dropdown menu now opens upwards */}
                        {dropdownOpen && (
                            <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-lg shadow-lg py-2">
                                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-200 w-full">
                                    <Share2 className="h-5 w-5" />
                                    <span>Partager</span>
                                </button>
                                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-200 w-full" onClick={handleFavorisClick}>
                                    <Bookmark className="h-5 w-5" fill={isFavorited ? "currentColor" : "none"} />
                                    <span>Enregistrer</span>
                                </button>
                                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-200 w-full">
                                    <Flag className="h-5 w-5" />
                                    <span>Signaler</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showComments && (
                <Comments
                    postId={id}
                    comments={comments}
                    currentUser={currentUser}
                    onAddComment={handleAddComment}
                    showComments={showComments}
                    initialComments={initialComments}
                />
            )}
        </div>
    );
};

export default PostSwing;
