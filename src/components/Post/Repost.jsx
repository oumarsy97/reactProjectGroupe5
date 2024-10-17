import React, { useState } from 'react';
import { Repeat } from 'lucide-react';
import useCrud from "../../hooks/useCrudAxios";
import AlertService from "../../services/notifications/AlertService";

const Repost = ({ post, currentUser, onRepost }) => {
    const [showRepostModal, setShowRepostModal] = useState(false);
    const [repostComment, setRepostComment] = useState('');
    const { create: createRepost } = useCrud('posts/repost');

    const handleRepostClick = () => setShowRepostModal(true);

    const handleRepost = async (withComment = false) => {
        try {
            const repostPayload = {
                originalPostId: post.id,
                comment: withComment ? repostComment : null
            };
            await createRepost(repostPayload);
            AlertService.success("Post repartagé avec succès");
            setShowRepostModal(false);
            setRepostComment('');
            onRepost();
        } catch (error) {
            console.error("Error creating repost:", error);
            await AlertService.error("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    return (
        <>
            <button 
                className="flex items-center space-x-2 hover:text-violet-500 transition-colors"
                onClick={handleRepostClick}
            >
                <Repeat className="h-5 w-5" />
                <span>{post.repostCount}</span>
            </button>

            {showRepostModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Reposter</h3>
                    <textarea
                        className="w-full p-3 border rounded-md focus:outline-none focus:border-blue-400 transition mb-4"
                        placeholder="Ajouter un commentaire (optionnel)"
                        value={repostComment}
                        onChange={(e) => setRepostComment(e.target.value)}
                    />
                    <div className="flex justify-end space-x-4">
                        <button
                            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
                            onClick={() => setShowRepostModal(false)}
                        >
                            Annuler
                        </button>
                        <button
                            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                            onClick={() => handleRepost(false)}
                        >
                            Reposter
                        </button>
                        <button
                            className="px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-300"
                            onClick={() => handleRepost(true)}
                        >
                            Reposter avec commentaire
                        </button>
                    </div>
                </div>
            </div>            
            )}
        </>
    );
};

export default Repost;
