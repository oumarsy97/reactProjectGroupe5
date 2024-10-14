import React, { useState } from 'react';
import useCrud from "../../hooks/useCrudAxios";

const StoryViewer = ({ stories, initialStoryIndex, closeStory, markAsRead }) => {
    // ... (Keep the existing StoryViewer component code here)
};

const DisplayStories = ({ stories, markAsRead }) => {
    const [activeStoryIndex, setActiveStoryIndex] = useState(null);

    const openStory = (index) => setActiveStoryIndex(index);
    const closeStory = () => setActiveStoryIndex(null);

    return (
        <>
            {stories.map((story, index) => (
                <div key={index} className="flex flex-col items-center gap-2 justify-center mb-4 cursor-pointer" onClick={() => openStory(index)}>
                    <img src={story.userImage} alt={story.userName} className={`w-12 h-12 rounded-full border-2 ${story.isRead ? 'border-gray-400' : 'border-teal-500'}`} />
                    <div className="ml-4">
                        <p className="font-semibold">{story.userName}</p>
                    </div>
                </div>
            ))}

            {activeStoryIndex !== null && (
                <StoryViewer
                    stories={stories}
                    initialStoryIndex={activeStoryIndex}
                    closeStory={closeStory}
                    markAsRead={markAsRead}
                />
            )}
        </>
    );
};

export default DisplayStories;