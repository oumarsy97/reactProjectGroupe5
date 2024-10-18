import React, { useState, useEffect, useRef } from "react";
import useCrud from "../../hooks/useCrudAxios";
import { useQuery, useQueryClient } from "react-query";
import { useAuth } from "../../context/AuthContext";
import { TrashIcon, EyeIcon } from '@heroicons/react/solid';

const StoryViewer = ({ stories, initialStoryIndex, closeStory, markAsRead, deleteStory, viewStory,}) =>
{
    const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const { user } = useAuth();

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

    useEffect(() => {
        // Mark story as viewed when it's displayed
        const currentStory = stories[currentStoryIndex];
        if (currentStory && currentStory.actorId !== user?.id) {
            viewStory(currentStory.id);
        }
    }, [currentStoryIndex, stories]);

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
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="relative w-full h-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center blur-md"
                    style={{
                        backgroundImage: `url(${currentStory.photo[currentImageIndex]})`,
                    }}
                ></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <div className="relative w-1/2 h-full flex items-center justify-center">
                        <div className="absolute top-4 left-0 right-0 flex px-4">
                            {currentStory.photo.map((_, index) => (
                                <div key={index} className="flex-1 h-1 bg-gray-600 mx-0.5">
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
                        <div className="absolute top-8 left-4 flex items-center">
                            <img
                                src={currentStory.userImage}
                                alt={currentStory.userName}
                                className="w-10 h-10 rounded-full mr-2 border-2 border-white"
                            />
                            <span className="text-white font-semibold">
                                {currentStory.userName}
                            </span>
                        </div>
                        <img
                            src={currentStory.photo[currentImageIndex]}
                            alt="Story"
                            className="max-w-full h-full"
                        />
                        <div className="absolute bottom-16 left-4 right-4 p-4 rounded">
                            <p className="text-white text-center">
                                {currentStory.messages[currentImageIndex]}
                            </p>
                        </div>
                        {currentStory.actorId === user?.id && (
                            <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                                <button
                                    onClick={() => deleteStory(currentStory.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mr-2 flex items-center"
                                >
                                    <TrashIcon className="w-4 h-4 mr-1" />
                                    Delete
                                </button>
                                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                                    <EyeIcon className="w-4 h-4 mr-1" />
                                    {currentStory.vues} views
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={closeStory}
                    className="absolute top-4 right-4 text-white text-2xl z-20"
                >
                    &times;
                </button>
                <button
                    onClick={handlePrev}
                    className="absolute top-1/2 left-4 text-white text-4xl transform -translate-y-1/2 opacity-50 hover:opacity-100 z-20"
                >
                    &lt;
                </button>
                <button
                    onClick={handleNext}
                    className="absolute top-1/2 right-4 text-white text-4xl transform -translate-y-1/2 opacity-50 hover:opacity-100 z-20"
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
    const queryClient = useQueryClient();
    const crudStoryMyStories = useCrud("story/mystories");
    const crudStoryFollowed = useCrud("story/storyfollowed");
    const crudStoryPost = useCrud("story/create");
    const crudStoryDelete = useCrud("story/delete");
    const crudStoryView = useCrud("story/view");
    const crudStoryViews = useCrud("story/views");

    const {
        data: myStories = [],
        isLoading: isLoadingMyStories,
        error: myStoriesError
    } = useQuery("myStories", async () => {
        const fetchedStories = await crudStoryMyStories.get();
        return groupStories(fetchedStories);
    });
    const {
        data: followedStories = [],
        isLoading: isLoadingFollowedStories,
        error: followedStoriesError
    } = useQuery("storyfollowed", async () => {
        const fetchedStories = await crudStoryFollowed.get();
        return groupStories(fetchedStories);
    });

    useEffect(() => {
        if (followedStoriesError) {
            console.error("Error fetching followed stories:", followedStoriesError);
        }
    }, [followedStoriesError]);

    const groupStories = (stories) => {
        if (!Array.isArray(stories)) {
            console.error("Expected an array of stories, but received:", stories);
            return [];
        }

        const grouped = stories.reduce((acc, story) => {
            const actorId = story.idActory;
            if (!acc[actorId]) {
                acc[actorId] = {
                    id: story.id,
                    actorId,
                    userName: story.actor?.user ? `${story.actor.user.firstname} ${story.actor.user.lastname}` : "Unknown User",
                    userImage: story.actor?.user?.photo || "/default-avatar.png",
                    photo: [],
                    messages: [],
                    vues: story.vues || 0,
                    isRead: false,
                };
            }
            acc[actorId].photo.push(story.photo);
            acc[actorId].messages.push(story.description || "");
            acc[actorId].vues = Math.max(acc[actorId].vues, story.vues || 0);
            return acc;
        }, {});

        return Object.values(grouped);
    };

    const openStory = (index) => setActiveStoryIndex(index);
    const closeStory = () => setActiveStoryIndex(null);

    const markAsRead = async (story) => {
        try {
            await crudStoryView.create({ storyId: story.id });
            queryClient.invalidateQueries("storyfollowed");
        } catch (error) {
            console.error("Error marking story as read:", error);
        }
    };

    const addNewStory = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
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
            await crudStoryPost.create(formData);
            setIsNewStoryModalOpen(false);
            setSelectedFiles([]);
            setStoryMessage("");
            queryClient.invalidateQueries("myStories");
        } catch (error) {
            console.error("Error creating story:", error);
        }
    };

    const deleteStory = async (storyId) => {
        try {
            await crudStoryDelete.delete(storyId);
            queryClient.invalidateQueries("myStories");
            closeStory();
        } catch (error) {
            console.error("Error deleting story:", error);
        }
    };

    const viewStory = async (storyId) => {
        try {
            await crudStoryView.create({ storyId });
            queryClient.invalidateQueries("storyfollowed");
        } catch (error) {
            console.error("Error viewing story:", error);
        }
    };

    if (isLoadingMyStories || isLoadingFollowedStories) {
        return <div>Loading stories...</div>;
    }

    if (myStoriesError || followedStoriesError) {
        return <div>Error loading stories. Please try again later.</div>;
    }

    return (
        <div className="bg-gray-100">
            <div className="w-full rounded-2xl bg-gradient-to-r from-violet-400 to-gray-800 text-white p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Statut</h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                    <div
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => openStory(0)}
                    >
                        <div className="relative">
                            <img
                                src={user?.photo || "/default-avatar.png"}
                                alt="Your status"
                                className="w-16 h-16 rounded-full border-2 border-gray-300"
                            />
                            <button
                                className="absolute bottom-0 right-0 bg-teal-500 rounded-full px-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addNewStory();
                                }}
                            >
                                <span className="text-white font-bold">+</span>
                            </button>
                        </div>
                        <span className="mt-1 text-sm">Your Story</span>
                        {myStories.length > 0 && (
                            <div className="flex items-center mt-1">
                                <EyeIcon className="w-4 h-4 text-black mr-1" />
                                <span className="text-xs text-black">{myStories[0].vues}</span>
                            </div>
                        )}
                    </div>
                    {followedStories.length === 0 ? (
                        <p className="text-center text-gray-400 self-center">
                            No stories available
                        </p>
                    ) : (
                        followedStories.map((story, index) => (
                            <div
                                key={story.id}
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => openStory(index + 1)}
                            >
                                <img
                                    src={story.userImage}
                                    alt={story.userName}
                                    className={`w-16 h-16 rounded-full border-2 ${
                                        story.isRead ? "border-gray-300" : "border-teal-500"
                                    }`}
                                />
                                <span className="mt-1 text-sm">{story.userName}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {activeStoryIndex !== null && (
                <StoryViewer
                    stories={activeStoryIndex === 0 ? myStories : followedStories}
                    initialStoryIndex={activeStoryIndex === 0 ? 0 : activeStoryIndex - 1}
                    closeStory={closeStory}
                    markAsRead={markAsRead}
                    deleteStory={deleteStory}
                    viewStory={viewStory}
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
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">
                            Add a new story
                        </h2>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {selectedFiles.map((file, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full h-24 object-cover rounded"
                                />
                            ))}
                        </div>
                        <textarea
                            className="border p-2 w-full rounded mb-4"
                            placeholder="Add a caption..."
                            value={storyMessage}
                            onChange={(e) => setStoryMessage(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                                onClick={() => setIsNewStoryModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-teal-500 text-white px-4 py-2 rounded"
                                onClick={handleStorySubmit}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryApp;