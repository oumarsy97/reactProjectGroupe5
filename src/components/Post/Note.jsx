import React, { useState, useEffect } from 'react';
import { Star, X, Loader } from 'lucide-react';
import useCrud from "../../hooks/useCrudAxios";
import AlertService from "../../services/notifications/AlertService";

const StarRating = ({ idUser, idPost, onRatingChange }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [tempRating, setTempRating] = useState(0);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    const { create: createNote } = useCrud('posts/notes');
    const { get: getNote } = useCrud(`posts/notes/${idPost}`);

    useEffect(() => {
        checkExistingVote();
    }, []);

    const checkExistingVote = async () => {
        setIsLoading(true);
        try {
            const existingNote = await getNote();
            if (existingNote && existingNote.note) {
                setRating(existingNote.note);
                setHasVoted(true);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la note:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStarClick = (index) => {
        if (hasVoted) return;
        setTempRating(index);
        setIsConfirmOpen(true);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        setIsConfirmOpen(false);
        try {
         const datas =    await createNote({ idPost, note: tempRating });

            setRating(tempRating);
            setHasVoted(true);
            AlertService.success('Votre votre est bien Pris en compte !!');
            if (onRatingChange) {
                onRatingChange(idUser, idPost, tempRating);
            }
        } catch (error) {
            await AlertService.error("Erreur lors de l'enregistrement de la note:", error);
            // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsConfirmOpen(false);
        setTempRating(0);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, index) => {
                    index += 1;
                    return (
                        <Star
                            key={index}
                            className={`w-8 h-8 transition-colors duration-200 ${
                                hasVoted ? 'cursor-default' : 'cursor-pointer'
                            } ${
                                index <= (hover || rating) ? 'text-purple-500 fill-purple-500' : 'text-gray-300'
                            }`}
                            onClick={() => handleStarClick(index)}
                            onMouseEnter={() => !hasVoted && setHover(index)}
                            onMouseLeave={() => !hasVoted && setHover(rating)}
                        />
                    );
                })}
            </div>
            {hasVoted && (
                <p className="mt-2 text-sm text-gray-600">Votre note: {rating} étoile(s)</p>
            )}
            {isConfirmOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Confirmer votre note</h3>
                            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="mb-4">
                            Êtes-vous sûr de vouloir attribuer une note de {tempRating} étoile(s) à ce post ?
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StarRating;