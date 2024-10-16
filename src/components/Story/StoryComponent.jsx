import React, { useState, useEffect, useRef } from 'react';
import useCrud from "../../hooks/useCrudAxios";
import { useAuth } from '../../context/AuthContext';
import { Eye, Trash2, Plus } from 'lucide-react';
import axios from 'axios';

const StoryViewer = ({ stories, initialStoryIndex, closeStory, markAsRead, deleteStory }) => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        const timer = setInterval(() => {
            if (progress < 100) {
                setProgress(prev => prev + 1);
            } else {
                handleNext();
            }
        }, 30);

        return () => clearInterval(timer);
    }, [progress]);

    const handleNext = () => {
        const currentStory = stories[currentStoryIndex];
        if (currentImageIndex < currentStory.photo.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
            setProgress(0);
        } else if (currentStoryIndex < stories.length - 1) {
            markAsRead(currentStory);
            setCurrentStoryIndex(prev => prev + 1);
            setCurrentImageIndex(0);
            setProgress(0);
        } else {
            markAsRead(currentStory);
            closeStory();
        }
    };

    const handlePrev = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
            setProgress(0);
        } else if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
            setCurrentImageIndex(stories[currentStoryIndex - 1].photo.length - 1);
            setProgress(0);
        }
    };

    const currentStory = stories[currentStoryIndex];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-full max-w-3xl h-full bg-gradient-to-b from-black to-purple-900 rounded-2lg overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-xl"
                    style={{ backgroundImage: `url(${currentStory.photo[currentImageIndex]})` }}
                ></div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full px-10">
                    <div className="w-4/5 flex p-2 absolute top-2">
                        {currentStory.photo.map((_, index) => (
                            <div key={index} className="flex-1 h-1 bg-gray-600 mx-1">
                                <div
                                    className="h-full bg-white"
                                    style={{
                                        width: index === currentImageIndex ? `${progress}%` : index < currentImageIndex ? '100%' : '0%',
                                    }}
                                ></div>
                            </div>
                        ))}
                    </div>

                    <img
                        src={currentStory.photo[currentImageIndex]}
                        alt="Story"
                        className="rounded-lg max-w-full h-full"
                    />

                    <div className="absolute top-8 left-20 flex items-center">
                        <img
                            src={currentStory.userImage}
                            alt={currentStory.userName}
                            className={`w-10 h-10 rounded-full mr-2 border-2 ${currentStory.isRead ? 'border-gray-400' : 'border-teal-500'}`}
                        />
                        <span className="text-white font-semibold">{currentStory.userName}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 flex items-center text-white">
                        <Eye className="mr-2" size={20} />
                        <span>{currentStory.views}</span>
                    </div>
                </div>

                <button onClick={closeStory} className="absolute top-4 right-4 text-white text-2xl z-10">&times;</button>
                {currentStory.actorId === user.id && (
                    <button 
                        onClick={() => deleteStory(currentStory.actorId)} 
                        className="absolute top-4 right-12 text-white z-10"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
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

const StoryApp = ({ userId }) => {
    const [activeStoryIndex, setActiveStoryIndex] = useState(null);
    const [isNewStoryModalOpen, setIsNewStoryModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [storyTitle, setStoryTitle] = useState("");
    const [storyDescription, setStoryDescription] = useState("");
    const fileInputRef = useRef(null);
    const { user } = useAuth();
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const crudStory = useCrud('story');

    useEffect(() => {
        fetchStories();
    }, [userId]);

    const fetchStories = async () => {
        try {
            console.log("Fetching stories for userId:", userId);
            let endpoint = userId ? 'storyfollowed' : 'mystories';
            const response = await crudStory.get(endpoint);
            const fetchedStories = response.data;
            console.log("Fetched stories:", fetchedStories);

            if (!Array.isArray(fetchedStories)) {
                throw new Error("Les données récupérées ne sont pas un tableau");
            }

            const groupedStories = fetchedStories.reduce((acc, story) => {
                const actorId = story.actor.id;
                if (!acc[actorId]) {
                    acc[actorId] = {
                        actorId: actorId,
                        userName: story.actor.user.firstname + ' ' + story.actor.user.lastname,
                        userImage: story.actor.user.photo,
                        photo: [],
                        title: [],
                        description: [],
                        views: story.vues,
                        isRead: false
                    };
                }
                acc[actorId].photo.push(story.photo);
                acc[actorId].title.push(story.title || '');
                acc[actorId].description.push(story.description || '');
                return acc;
            }, {});

            const processedStories = Object.values(groupedStories);
            console.log("Processed stories:", processedStories);

            setStories(processedStories);
            setIsLoading(false);
        } catch (err) {
            console.error("Erreur détaillée lors du chargement des stories:", err);
            setError(`Erreur lors du chargement des stories: ${err.message}`);
            setIsLoading(false);
        }
    };

    const handleStorySubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('photo', selectedFile);
            formData.append('title', storyTitle);
            formData.append('description', storyDescription);

            const response = await axios.post('/api/story/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const newStory = {
                actorId: user.id,
                userName: user.firstname + ' ' + user.lastname,
                userImage: user.photo,
                photo: [response.data.data.photo],
                title: [response.data.data.title],
                description: [response.data.data.description],
                views: 0,
                isRead: false,
            };

            setStories(prev => [newStory, ...prev]);
            setIsNewStoryModalOpen(false);
            setSelectedFile(null);
            setStoryTitle("");
            setStoryDescription("");
        } catch (error) {
            console.error("Erreur lors de l'ajout de la story:", error);
            // Affichez un message d'erreur à l'utilisateur ici
        }
    };

    const markAsRead = async (story) => {
        try {
            await axios.post(`/api/story/view/${story.actorId}`);
            setStories(prevStories => 
                prevStories.map(s => 
                    s.actorId === story.actorId ? { ...s, isRead: true, views: s.views + 1 } : s
                )
            );
        } catch (error) {
            console.error("Erreur lors du marquage de la story comme lue:", error);
        }
    };

    const deleteStory = async (storyId) => {
        try {
            await axios.delete(`/api/story/delete/${storyId}`);
            setStories(prevStories => prevStories.filter(story => story.actorId !== storyId));
            closeStory();
        } catch (error) {
            console.error("Erreur lors de la suppression de la story:", error);
        }
    };

    const openStory = (index) => setActiveStoryIndex(index);
    const closeStory = () => setActiveStoryIndex(null);

    const addNewStory = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setIsNewStoryModalOpen(true);
    };

    if (isLoading) return <div>Chargement des stories...</div>;
    // if (error) return <div>Erreur: {error}</div>;
    
    return (
        <div className="flex">
            <div className="w-full rounded-2xl bg-gradient-to-r from-violet-400 to-gray-800 text-white p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Statut</h2>
                <div className='flex gap-4'>
                    {!userId && (
                        <div className="flex items-center mb-6 cursor-pointer border-r p-2" onClick={addNewStory}>
                            <div className="relative">
                                <img src={user?.photo} alt="Your status" className="w-14 h-14 rounded-full border" />
                                <button className="absolute bottom-0 right-0 bg-teal-500 rounded-full p-1">
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                    {stories.map((story, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 justify-center mb-4 cursor-pointer" onClick={() => openStory(index)}>
                            <img src={story.userImage} alt={story.userName} className={`w-12 h-12 rounded-full border-2 ${story.isRead ? 'border-gray-400' : 'border-teal-500'}`} />
                            <div className="ml-4">
                                <p className="font-semibold">{story.userName}</p>
                                {story.actorId === user.id && (
                                    <div className="flex items-center mt-1">
                                        <Eye className="text-white mr-1" size={16} />
                                        <span className="text-sm">{story.views}</span>
                                    </div>
                                )}
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
                    deleteStory={deleteStory}
                />
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileSelect}
            />

            {isNewStoryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Ajouter un nouveau statut</h2>
                        <div className="flex flex-col mb-4">
                            {selectedFile && (
                                <img src={URL.createObjectURL(selectedFile)} alt="Prévisualisation" className="mb-2 rounded" />
                            )}
                        </div>
                        <input
                            type="text"
                            className="border p-2 w-full mb-2"
                            placeholder="Titre de la story"
                            value={storyTitle}
                            onChange={(e) => setStoryTitle(e.target.value)}
                        />
                        <textarea
                            className="border p-2 w-full"
                            placeholder="Description de la story"
                            value={storyDescription}
                            onChange={(e) => setStoryDescription(e.target.value)}
                        />
                        <div className="flex justify-end mt-4">
                            <button className="bg-teal-500 text-white px-4 py-2 rounded" onClick={handleStorySubmit}>Publier</button>
                            <button className="bg-gray-400 text-white px-4 py-2 rounded ml-2" onClick={() => setIsNewStoryModalOpen(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryApp;