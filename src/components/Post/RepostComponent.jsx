/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from 'react';
import { Edit, Repeat } from 'lucide-react';
import useCrud from "../../hooks/useCrudAxios";
import AlertService from "../../services/notifications/AlertService";
import { useActor } from "../../context/ActorContext";

const RepostComponent = ({ post, repost }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [repostContent, setRepostContent] = useState('');
    const [showModal, setShowModal] = useState(false);

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
        setRepostContent('');
        setShowDropdown(false);
    };

    const openModal = () => {
        setShowModal(true);
        setShowDropdown(false);
    };

    const closeModal = () => {
        setShowModal(false);
        handleCancelRepost();
    };

    const getTimeDifference = (createdAt) => {
        const now = new Date();
        const postDate = new Date(createdAt);
        const diffInSeconds = (now - postDate) / 1000;
        const diffInMinutes = diffInSeconds / 60;
        const diffInHours = diffInMinutes / 60;

        if (diffInMinutes < 60) {
            return `${Math.floor(diffInMinutes)} minutes ago`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hours ago`;
        } else {
            return postDate.toLocaleDateString();
        }
    };

    return (
        <>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
            >
                <Repeat className="h-5 w-5" />
                <span>{repostCount || 0}</span>
            </button>

            {showDropdown && (
                <div className="mt-12 -ml-6 bg-white border border-gray-200 rounded-b-lg shadow-lg p-4 absolute z-10 w-96">
                    <button
                        onClick={openModal}
                        className="flex items-center w-full text-left p-2 space-x-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Edit className="text-blue-500 h-9 w-9" />
                        <div>
                            <p className="font-semibold">Reposter en donnant votre avis</p>
                            <p className="text-sm text-gray-500">Créez un nouveau post en ajoutant un commentaire</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRepost(false)}
                        className="flex items-center w-full text-left p-2 space-x-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Repeat className="text-blue-500 h-8 w-8" />
                        <div>
                            <p className="font-semibold">Reposter</p>
                            <p className="text-sm text-gray-500">Diffusez instantanément le post</p>
                        </div>
                    </button>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ease-out">
                    <div className="bg-gradient-to-b from-gray-900 to-purple-900 rounded-xl shadow-lg p-6 text-white w-full max-w-4xl relative transform transition-transform duration-300 ease-out scale-95 hover:scale-100">
                        <h2 className="text-2xl font-bold mb-4">Ajouter un commentaire</h2>

                        {/* Compteur de caractères */}
                        <div className="mb-2 text-sm text-right text-gray-300">
                            {repostContent.length}/280 caractères
                        </div>

                        {/* Système de validation */}
                        <div className={`mb-4 ${repostContent.trim() === ""}`}>
                            <textarea
                                value={repostContent}
                                onChange={(e) => setRepostContent(e.target.value)}
                                placeholder="Ajouter un commentaire à votre repost..."
                                className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg p-3 focus:border-purple-500 focus:ring focus:ring-purple-400 shadow-sm outline-none resize-none transition-all duration-300 ease-in-out"
                                rows="4"
                                maxLength="280"
                            />
                            {repostContent.trim() === "" && (
                                <p className="text-red-500 text-md ml-2 mt-1">Le champ ne peut pas être vide.</p>
                            )}
                        </div>

                        {/* Prévisualisation en direct */}
                        <div className="bg-gray-800 p-4 rounded-lg mb-4">
                            <h3 className="font-semibold text-lg mb-2">Prévisualisation :</h3>
                            <div className="border border-gray-700 rounded-xl p-3 text-sm">
                                {repostContent.length > 0 ? (
                                    <p>{repostContent}</p>
                                ) : (
                                    <p className="text-gray-500">Votre commentaire apparaîtra ici...</p>
                                )}
                            </div>
                        </div>

                        {/* Contenu du post original */}
                        <div className="border rounded-xl p-4 bg-gray-800 mb-4 overflow-auto h-80">
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
                                        <p className="text-sm">{getTimeDifference(post.createdAt)}</p>
                                    </div>
                                </div>
                            )}

                            <p className="mb-2">{post.description || 'Pas de contenu disponible pour ce post.'}</p>

                            {post.photo && (
                                <div className="my-2">
                                    <img
                                        src={post.photo}
                                        alt="Image du post"
                                        className="w-full h-auto rounded-lg shadow-md"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Ajout de bouton avec animation */}
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={closeModal}
                                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-300 ease-in-out"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={() => {
                                    if (repostContent.trim() !== "") {
                                        handleRepost(true);
                                        closeModal();
                                    }
                                }}
                                className={`bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 hover:scale-105 transition-all duration-300 ease-in-out ${repostContent.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                                disabled={repostContent.trim() === ""}
                            >
                                Reposter
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default RepostComponent;