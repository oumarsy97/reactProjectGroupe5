import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, X, Send, ChevronUp, ChevronDown } from 'lucide-react';
import useCrud from "../../hooks/useCrudAxios";
import {getTimeDifference} from "../../utils/tokenUtils";
import {useAuth} from "../../context/AuthContext";

const CommentSystemDemo = ({id}, {comment}) => {

    const { create: createComment } = useCrud(`posts/comment/${id}`);
    const crudComment = useCrud( `posts/comment/${id}`);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const {user } = useAuth();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const rawData = await crudComment.get();

                // Mapper les données brutes au format souhaité
                const formattedComments = rawData.map(comment => ({
                    id: comment.id,
                    userName: comment.author.id === user.id
                        ? "Vous"
                        : `${comment.author.firstname} ${comment.author.lastname}`,
                    userImage: comment.author.photo, // Utilisation d'une image placeholder
                    content: comment.content,
                    timestamp: getTimeDifference(comment.createdAt), // Vous devrez implémenter cette fonction
                    likes: comment.likes,
                    isLiked: comment.isLikedByCurrentUser, // Assurez-vous que cette propriété existe dans vos données brutes
                    replies: [] // Si vous avez des réponses, vous devrez les formater également
                }));


                setComments(formattedComments);
            } catch (error) {
                console.error("Erreur lors de la récupération des commentaires:", error);
            }
        };

        fetchComments();
    }, []);
    const handleLikeComment = (commentId, isReply = false, parentId = null) => {
        setComments(prevComments => {
            const updateLikes = (comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                        isLiked: !comment.isLiked
                    };
                }
                return {
                    ...comment,
                    replies: comment.replies.map(reply => updateLikes(reply))
                };
            };

            if (isReply && parentId) {
                return prevComments.map(comment =>
                    comment.id === parentId
                        ? { ...comment, replies: comment.replies.map(updateLikes) }
                        : comment
                );
            }

            return prevComments.map(updateLikes);
        });
    };

    const handleAddComment = (newCommentContent, parentId = null) => {
        const newComment = {
            id: Date.now(),
            userName: 'Vous',
            userImage: '/api/placeholder/30',
            content: newCommentContent,
            timestamp: 'À l\'instant',
            likes: 0,
            isLiked: false,
            replies: []
        };
        const fetchComment = async () => {
            try {
                const response = await createComment({ content: newCommentContent });
                console.log(response);
            } catch (error) {
                console.error("Erreur lors de la création du commentaire:", error);
            }
        }
        fetchComment();
        setComments(prevComments => {
            if (parentId) {
                return prevComments.map(comment =>
                    comment.id === parentId
                        ? { ...comment, replies: [...comment.replies, newComment] }
                        : comment
                );
            }
            return [...prevComments, newComment];
        });
    };

    return (
        <div className="p-4">
            <button
                onClick={() => setIsPopupOpen(true)}
            >
                <MessageCircle className="h-5 w-5"/>
            </button>

            <CommentsPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                comments={comments}
                onAddComment={(content) => handleAddComment(content)}
                onReply={(parentId, content) => handleAddComment(content, parentId)}
                onLikeComment={(commentId, isReply, parentId) => handleLikeComment(commentId, isReply, parentId)}
            />
        </div>
    );
};

const CommentsPopup = ({ isOpen, onClose, comments, onAddComment, onReply, onLikeComment }) => {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [animationState, setAnimationState] = useState('closed');
    const [popupHeight, setPopupHeight] = useState('60vh');

    useEffect(() => {
        if (isOpen) {
            setAnimationState('opening');
            const timer = setTimeout(() => setAnimationState('open'), 300);
            return () => clearTimeout(timer);
        } else {
            setAnimationState('closing');
            const timer = setTimeout(() => setAnimationState('closed'), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmitComment = () => {
        if (!newComment.trim()) return;
        if (replyingTo) {
            onReply(replyingTo, newComment);
            setReplyingTo(null);
        } else {
            onAddComment(newComment);
        }
        setNewComment('');
    };

    const togglePopupHeight = () => {
        setPopupHeight(popupHeight === '60vh' ? '90vh' : '60vh');
    };

    if (animationState === 'closed' && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 ${
                animationState === 'closing' || animationState === 'closed' ? 'bg-opacity-0 pointer-events-none' : 'bg-opacity-50'
            }`}
            onClick={onClose}
        >
            <div
                className="flex items-end justify-center h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className={`w-full max-w-lg bg-white rounded-t-2xl overflow-hidden shadow-2xl transform transition-all duration-300 ease-out
                    ${animationState === 'opening' || animationState === 'open' ? 'translate-y-0' : 'translate-y-full'}`}
                    style={{ maxHeight: popupHeight, transition: 'max-height 0.3s ease-out' }}
                >
                    <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <h2 className="text-xl font-bold">Commentaires</h2>
                        <div className="flex items-center space-x-2">
                            <button onClick={togglePopupHeight} className="text-white hover:text-gray-200 transition-colors">
                                {popupHeight === '60vh' ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                            </button>
                            <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(100% - 140px)' }}>
                        {comments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onReply={(id) => setReplyingTo(id)}
                                onLike={(id, isReply) => onLikeComment(id, isReply, comment.id)}
                                depth={0}
                            />
                        ))}
                    </div>
                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex items-center mb-2">
                            {replyingTo && (
                                <div className="text-sm text-gray-500 mr-2 bg-blue-100 px-2 py-1 rounded-full">
                                    Réponse à: {comments.find(c => c.id === replyingTo)?.userName}
                                    <button onClick={() => setReplyingTo(null)} className="ml-2 text-red-500 hover:text-red-700">
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="flex-grow p-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={replyingTo ? "Écrire une réponse..." : "Ajouter un commentaire..."}
                            />
                            <button
                                onClick={handleSubmitComment}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-r-full hover:from-blue-600 hover:to-purple-700 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CommentItem = ({ comment, onReply, onLike, depth }) => {
    const [showReplies, setShowReplies] = useState(depth === 0);

    return (
        <div className={`space-y-2 ${depth > 0 ? 'ml-6' : ''} mb-4`}>
            <div className="flex space-x-3 bg-white p-3 rounded-lg shadow-sm">
                <img src={comment.userImage} className="w-10 h-10 rounded-full border-2 border-blue-500" alt={comment.userName} />
                <div className="flex-1">
                    <p className="font-bold text-blue-600">{comment.userName}</p>
                    <p className="text-gray-700">{comment.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                        <span>{comment.timestamp}</span>
                        <button
                            onClick={() => onLike(comment.id, depth > 0)}
                            className="flex items-center space-x-1 transition-colors hover:text-red-500"
                        >
                            <Heart className={`w-4 h-4 ${comment.isLiked ? 'text-red-500 fill-current' : ''}`} />
                            <span>{comment.likes}</span>
                        </button>
                        <button
                            onClick={() => onReply(comment.id)}
                            className="flex items-center space-x-1 transition-colors hover:text-blue-500"
                        >
                            <MessageCircle className="w-3 h-3" />
                            <span>Répondre</span>
                        </button>
                    </div>
                </div>
            </div>

            {comment.replies.length > 0 && (
                <>
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="text-sm text-blue-500 hover:text-blue-700 transition-colors ml-12"
                    >
                        {showReplies ? 'Masquer les réponses' : `Voir les ${comment.replies.length} réponses`}
                    </button>
                    {showReplies && (
                        <div className="space-y-2 mt-2">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    onReply={onReply}
                                    onLike={onLike}
                                    depth={depth + 1}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CommentSystemDemo;