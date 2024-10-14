import React, { useState, useEffect } from 'react';

const StoryViewer = ({ stories, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    const currentStory = stories[currentIndex];

    useEffect(() => {
        // Progression automatique à travers les stories
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    handleNextStory();
                    return 0;
                }
                return prev + 1;
            });
        }, 30); // Le délai contrôle la vitesse de remplissage (peut être ajusté)

        return () => clearInterval(interval);
    }, [currentIndex]);

    const handleNextStory = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setProgress(0);
        } else {
            onClose(); // Fermer la vue des stories une fois toutes les stories terminées
        }
    };

    const handlePreviousStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setProgress(0);
        }
    };

    return (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-90 flex items-center justify-center">
            <div className="w-full max-w-md relative">
                {/* Barre de progression */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-300">
                    <div
                        className="h-full bg-white"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Story content */}
                <div className="relative">
                    {currentStory ? (
                        <img
                            src={currentStory.photo}
                            alt="story"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <video
                            src={currentStory.url}
                            className="w-full h-full object-cover rounded-lg"
                            autoPlay
                            controls
                        />
                    )}
                </div>

                {/* Navigation */}
                <div className="absolute inset-0 flex justify-between items-center px-4">
                    <button
                        onClick={handlePreviousStory}
                        className="h-full w-1/4 bg-transparent text-white focus:outline-none"
                    >
                        {/* Clic gauche */}
                    </button>
                    <button
                        onClick={handleNextStory}
                        className="h-full w-1/4 bg-transparent text-white focus:outline-none"
                    >
                        {/* Clic droit */}
                    </button>
                </div>

                {/* Bouton Fermer */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default StoryViewer;
