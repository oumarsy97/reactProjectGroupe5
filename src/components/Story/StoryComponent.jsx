import React, { useState, useEffect, useRef } from "react";
import useCrud from "../../hooks/useCrudAxios";
import { useQuery, QueryClient } from "react-query";
import { useAuth } from "../../context/AuthContext";

const storiesData = [

];

const StoryViewer = ({
    stories,
    initialStoryIndex,
    closeStory,
    markAsRead,
}) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const crudStory = useCrud("story/storyfollowed");

    useEffect(() => {
        const timer = setInterval(() => {
            if (progress < 100) {
                setProgress((prev) => prev + 1);
            } else {
                handleNext();
            }
        }, 30);

        return () => clearInterval(timer);
    }, [progress]);

    const handleNext = () => {
        const currentStory = stories[currentStoryIndex];
        if (currentImageIndex < currentStory.photo.length - 1) {
            setCurrentImageIndex((prev) => prev + 1);
            setProgress(0);
        } else if (currentStoryIndex < stories.length - 1) {
            markAsRead(currentStory);
            setCurrentStoryIndex((prev) => prev + 1);
            setCurrentImageIndex(0);
            setProgress(0);
        } else {
            markAsRead(currentStory);
            closeStory();
        }
    };

    const handlePrev = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex((prev) => prev - 1);
            setProgress(0);
        } else if (currentStoryIndex > 0) {
            setCurrentStoryIndex((prev) => prev - 1);
            setCurrentImageIndex(stories[currentStoryIndex - 1].photo.length - 1);
            setProgress(0);
        }
    };

    const currentStory = stories[currentStoryIndex];

    return (
        <div className="fixed inset-0  bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-full  max-w-3xl h-full bg-gradient-to-b from-black to-purple-900 rounded-2lg overflow-hidden">
                {/* Image de fond floue */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-xl"
                    style={{
                        backgroundImage: `url(${currentStory.photo[currentImageIndex]})`,
                    }}
                ></div>

                {/* Conteneur principal pour le contenu centré */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-10">
                    {/* Barre de progression des images */}
                    <div className="w-4/5 flex p-2 absolute top-2">
                        {currentStory.photo.map((_, index) => (
                            <div key={index} className="flex-1 h-1 bg-gray-600 mx-1">
                                <div
                                    className="h-full bg-white"
                                    style={{
                                        width:
                                            index === currentImageIndex
                                                ? `${progress}%`
                                                : index < currentImageIndex
                                                    ? "100%"
                                                    : "0%",
                                    }}
                                ></div>
                            </div>
                        ))}
                    </div>

                    {/* Image claire centrée */}
                    <img
                        src={currentStory.photo[currentImageIndex]}
                        alt="Story"
                        className="rounded-lgmax-w-full h-full"
                    />

                    {/* Information utilisateur */}
                    <div className="absolute top-8 left-20 flex items-center">
                        <img
                            src={currentStory.photo}
                            alt={currentStory.userName}
                            className={`w-10 h-10 rounded-full mr-2 border-2 ${currentStory.isRead ? "border-gray-400" : "border-teal-500"}`}
                        />
                        <span className="text-white font-semibold">
                            {currentStory.userName}
                        </span>
                    </div>

                    {/* Texte et vues de l'image */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-center">
                        <p className="text-white">
                            {currentStory.messages[currentImageIndex]}
                        </p>
                        <input
                            type="text"
                            className="bg-opacity-40 bg-black w-full p-2 mt-2 rounded text-white"
                        />
                    </div>
                </div>

                {/* Boutons de navigation */}
                <button
                    onClick={closeStory}
                    className="absolute top-4 right-4 text-white text-2xl z-10"
                >
                    &times;
                </button>
                <button
                    onClick={handlePrev}
                    className="absolute top-1/2 left-4 text-white text-4xl transform -translate-y-1/2 opacity-50 hover:opacity-100 z-10"
                >
                    &lt;
                </button>
                <button
                    onClick={handleNext}
                    className="absolute top-1/2 right-4 text-white text-4xl transform -translate-y-1/2 opacity-50 hover:opacity-100 z-10"
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

const StoryApp = () => {
    const [activeStoryIndex, setActiveStoryIndex] = useState(null);
    const [isNewStoryModalOpen, setIsNewStoryModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [storyMessage, setStoryMessage] = useState("");
    const fileInputRef = useRef(null);
    const { user } = useAuth();
    const crudStory = useCrud("story/mystories");
    const crudStoryPost = useCrud("story/create");

    const {
        data: stories = [],
        isLoading,
        error,
    } = useQuery("stories", async () => {
        const fetchedStories = await crudStory.get();
        const groupedStories = fetchedStories.reduce((acc, story) => {
            const actorId = story.actor.id;
            if (!acc[actorId]) {
                acc[actorId] = {
                    actorId,
                    userName: `${story.actor.user.firstname} ${story.actor.user.lastname}`,
                    userImage: story.actor.user.photo,
                    photo: [],
                    messages: [],
                    views: story.vues,
                    isRead: false,
                };
            }
            acc[actorId].photo.push(story.photo);
            acc[actorId].messages.push(story.description || "");
            return acc;
        }, {});
        return Object.values(groupedStories);
    });

    const openStory = (index) => setActiveStoryIndex(index);
    const closeStory = () => setActiveStoryIndex(null);

    const markAsRead = (story) => {
        // Vous pouvez gérer la lecture des stories ici si besoin
    };

    const addNewStory = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files); // Stocke les fichiers réels
        setIsNewStoryModalOpen(true);
    };

    const handleStorySubmit = async () => {
        const formData = new FormData();
        formData.append("title", storyMessage);
        formData.append("description", storyMessage);

        selectedFiles.forEach((file) => {
            formData.append("photo", file);
        });

        try {
            const response = await crudStoryPost.create(formData);
            setIsNewStoryModalOpen(false);
            setSelectedFiles([]);
            setStoryMessage("");
        } catch (error) {
            console.error("Erreur lors de la création de la story:", error);
        }
    };


    return (
        <div className="flex">
            <div className="w-full rounded-2xl bg-gradient-to-r from-violet-400 to-gray-800 text-white p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Statut</h2>
                <div className="flex gap-4">
                    <div className="flex items-center mb-6 cursor-pointer border-r p-2">
                        <div className="relative">
                            <img
                                src={user?.photo}
                                alt="Your status"
                                onClick={() =>
                                    openStory(stories.filter((s) => s.actorId === user?.id))
                                }
                                className="w-14 h-14 rounded-full"
                            />
                            <button
                                className="absolute bottom-0 right-0 bg-teal-500 rounded-full px-2"
                                onClick={addNewStory}
                            >
                                <span>+</span>
                            </button>
                        </div>
                    </div>
                    {stories.filter((s) => s.actorId !== user?.id).length === 0 && (
                        <p className="text-center text-gray-400 mb-4">
                            Aucun statut disponible
                        </p>
                    )}
                    {stories
                        .filter((s) => s.actorId !== user?.id)
                        .map((story, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-2 justify-center mb-4 cursor-pointer"
                                onClick={() =>
                                    openStory(
                                        index + stories.filter((s) => s.actorId === user?.id).length
                                    )
                                }
                            >
                                <img
                                    src={story.userImage}
                                    alt={story.photo}
                                    className={`w-12 h-12 rounded-full border-2 ${story.isRead ? "border-gray-400" : "border-teal-500"}`}
                                />
                                <div className="ml-4">
                                    <p className="font-semibold">{story.userName}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            {activeStoryIndex !== null && (
                <StoryViewer
                    stories={stories}
                    initialStoryIndex={activeStoryIndex}
                    closeStory={closeStory}
                    markAsRead={markAsRead}
                />
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
            />

            {isNewStoryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-1/3">
                        <h2 className="text-lg font-semibold mb-2">
                            Ajouter un nouveau statut
                        </h2>
                        <div className="grid grid-cols-4 mb-4">
                            {selectedFiles.map((file, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(file)} // Utilise l'aperçu temporaire ici
                                    alt="Prévisualisation"
                                    className="mb-2 rounded w-full"
                                />
                            ))}

                        </div>
                        <textarea
                            className="border p-2 w-full"
                            placeholder="Ajouter un commentaire..."
                            value={storyMessage}
                            onChange={(e) => setStoryMessage(e.target.value)}
                        />
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-teal-500 text-white px-4 py-2 rounded"
                                onClick={handleStorySubmit}
                            >
                                Publier
                            </button>
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded ml-2"
                                onClick={() => setIsNewStoryModalOpen(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryApp;
