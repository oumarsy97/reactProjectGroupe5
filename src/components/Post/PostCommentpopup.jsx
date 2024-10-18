import React, { useRef, useState } from 'react';
import { Heart, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import useCrud from "../../hooks/useCrudAxios";
import { getTimeDifference } from "../../utils/tokenUtils";

const Comments = ({ postId, currentUser, showComments }) => {
    const [showAllComments, setShowAllComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const inputRef = useRef(null);
    const queryClient = useQueryClient();
    const crudComment = useCrud(`posts/comment/${postId}`);

    // Query pour récupérer les commentaires
    const { data: comments = [], isLoading } = useQuery({
        queryKey: ['comments', postId],
        queryFn: async () => {
            try {
                const rawData = await crudComment.get();
                return rawData.map(comment => ({
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
            } catch (error) {
                throw new Error("Erreur lors de la récupération des commentaires");
            }
        },
        enabled: showComments, // Ne charge les commentaires que lorsque showComments est true
        staleTime: 30000, // Considère les données comme fraîches pendant 30 secondes
        cacheTime: 5 * 60 * 1000, // Garde les données en cache pendant 5 minutes
    });

    // Mutation pour ajouter un commentaire
    const addCommentMutation = useMutation({
        mutationFn: async (newCommentText) => {
            const response = await crudComment.create({ content: newCommentText });
            return {
                id: response.id,
                userName: 'Vous',
                userImage: currentUser.photo,
                content: newCommentText,
                timestamp: 'À l\'instant',
                likes: 0,
                isLiked: false,
                replies: []
            };
        },
        onSuccess: (newComment) => {
            // Met à jour le cache avec le nouveau commentaire
            queryClient.setQueryData(['comments', postId], (old = []) => [newComment, ...old]);
            setNewComment('');
        },
        onError: (error) => {
            console.error("Erreur lors de l'ajout du commentaire:", error);
            // Vous pouvez ajouter ici une notification d'erreur
        }
    });

    // Mutation pour le like d'un commentaire
    const toggleLikeMutation = useMutation({
        mutationFn: async ({ commentId, isCurrentlyLiked }) => {
            await crudComment.create({ commentId }, true);
            return { commentId, isCurrentlyLiked };
        },
        onMutate: async ({ commentId, isCurrentlyLiked }) => {
            // Annulation des requêtes en cours
            await queryClient.cancelQueries(['comments', postId]);

            // Snapshot de l'état précédent
            const previousComments = queryClient.getQueryData(['comments', postId]);

            // Mise à jour optimiste
            queryClient.setQueryData(['comments', postId], (old = []) => {
                return old.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            isLiked: !isCurrentlyLiked,
                            likes: isCurrentlyLiked ? comment.likes - 1 : comment.likes + 1
                        };
                    }
                    return comment;
                });
            });

            return { previousComments };
        },
        onError: (err, variables, context) => {
            // En cas d'erreur, on revient à l'état précédent
            queryClient.setQueryData(['comments', postId], context.previousComments);
        }
    });

    const CommentItem = ({ comment }) => (
        <div className="flex space-x-3 py-3">
            <img
                src={comment.userImage}
                className="w-8 h-8 rounded-full object-cover"
                alt={comment.userName}
            />
            <div className="flex-1">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="font-semibold text-sm">{comment.userName}</span>
                        <span className="ml-2 text-sm text-gray-600">{comment.content}</span>
                    </div>
                    <button
                        onClick={() => toggleLikeMutation.mutate({
                            commentId: comment.id,
                            isCurrentlyLiked: comment.isLiked
                        })}
                        className={`flex items-center ${comment.isLiked ? 'text-red-500' : 'text-gray-400'}`}
                    >
                        <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                    </button>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    <span className="text-xs text-gray-500">{comment.likes} likes</span>
                </div>
            </div>
        </div>
    );

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        addCommentMutation.mutate(newComment);
    };

    const displayedComments = showAllComments ? comments : comments.slice(0, 1);

    if (isLoading) {
        return (
            <div className="border-t border-gray-100 bg-gray-50 p-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-20 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="border-t border-gray-100 bg-gray-50">
            <div className="p-4">
                <div className="flex items-center space-x-2 mb-4">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ajouter un commentaire..."
                        ref={inputRef}
                    />
                    <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || addCommentMutation.isLoading}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>

                <div className="divide-y divide-gray-200">
                    {displayedComments.map(comment => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </div>

                {comments.length > 1 && (
                    <button
                        onClick={() => setShowAllComments(!showAllComments)}
                        className="w-full mt-2 flex items-center justify-center gap-2 text-sm text-blue-500 hover:text-blue-600 py-2"
                    >
                        {showAllComments ? (
                            <>
                                <ChevronUp className="w-4 h-4" />
                                Voir moins
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-4 h-4" />
                                Voir plus ({comments.length - 1} commentaires)
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Comments;