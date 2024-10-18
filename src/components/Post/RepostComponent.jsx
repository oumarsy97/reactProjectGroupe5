/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from 'react';
import { Repeat, X } from 'lucide-react';
import useCrud from "../../hooks/useCrudAxios";
import AlertService from "../../services/notifications/AlertService";
import { useActor } from "../../context/ActorContext";

const RepostComponent = ({ post, repost }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [repostContent, setRepostContent] = useState('');
    const [showCommentField, setShowCommentField] = useState(false);
    
    // Utiliser le post du repost si disponible, sinon utiliser le post directement
    const targetPost = repost ? repost.post : post;
    const [repostCount, setRepostCount] = useState(targetPost?.repostCount || 0);

    const { create: createRepost } = useCrud(`reposts/repost/${targetPost?.id}`);
    const { actor, setActor } = useActor();

    const reposts = Array.isArray(actor.reposts) ? actor.reposts : [];

    const handleRepost = async (withComment = false) => {
        if (!targetPost) {
            AlertService.error('Post non disponible pour le repost.');
            return;
        }

        const hasReposted = reposts.some(r => r.id === targetPost.id);
        if (hasReposted) {
            AlertService.error('Vous avez déjà reposté ce post.');
            return;
        }

        try {
            const repostData = withComment ? { content: repostContent } : {};
            const data = await createRepost(repostData);
            setActor({ ...actor, reposts: [...reposts, data] });
            setRepostCount(prevCount => prevCount + 1);
            AlertService.success('Post reposté avec succès');
            handleCancelRepost();
        } catch (error) {
            console.error("Détails de l'erreur :", error.response ? error.response.data : error);
            AlertService.error('Erreur lors du repost');
        }
    };
    
    const handleCancelRepost = () => {
        setIsModalOpen(false);
        setRepostContent('');
        setShowCommentField(false);
    };

    function getTimeDifference(createdAt) {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const differenceInMilliseconds = now - createdDate;

        const minutes = Math.floor(differenceInMilliseconds / 60000);
        const hours = Math.floor(differenceInMilliseconds / 3600000);
        const days = Math.floor(differenceInMilliseconds / 86400000);

        if (days > 0) {
            return `${days} jour(s)`;
        }
        if (hours > 0) {
            return `${hours} heure(s)`;
        }
        return `${minutes} minute(s)`;
    }

    if (!targetPost) {
        return null; // Ne rien rendre si aucun post n'est disponible
    }

    targetPost.getTimeDifference = getTimeDifference;

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
            >
                <Repeat className="h-5 w-5" />
                <span>{repostCount || 0}</span>
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl relative shadow-lg transform transition-all ease-in-out duration-300 scale-100">

                        <button
                            onClick={handleCancelRepost}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-xl font-semibold text-center mb-4">Reposter</h3>

                        {!showCommentField ? (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowCommentField(true)}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Reposter en donnant votre avis
                                </button>

                                <button
                                    onClick={() => handleRepost(false)}
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Reposter
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <textarea
                                        value={repostContent}
                                        onChange={(e) => setRepostContent(e.target.value)}
                                        placeholder="Ajouter un commentaire à votre repost..."
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none resize-none"
                                        rows="4"
                                    />
                                </div>

                                <div className="border rounded-lg p-4 bg-gray-100 mb-4 overflow-auto h-80">
                                    <h4 className="font-semibold mb-2">Post original :</h4>

                                    {post.user && (
                                        <div className="flex items-center mb-2">
                                            <img
                                                src={post.user.user.photo}
                                                alt={`Profil de ${post.user.lastname}`}
                                                className="w-8 h-8 rounded-full mr-2"
                                            />
                                            <div>
                                                <h3 className="font-semibold">{post.user.user.firstname} {post.user.user.lastname}</h3>
                                                <p className="text-gray-500 text-sm">{post.getTimeDifference(post.createdAt)}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <p>{post.description || 'Pas de contenu disponible pour ce post.'}</p><br />
                                    {post.photo && (
                                        <div className="mb-2">
                                            <img
                                                src={post.photo}
                                                alt="Image du post"
                                                className="w-full h-auto rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        onClick={handleCancelRepost}
                                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={() => handleRepost(true)}
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Reposter
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default RepostComponent;
