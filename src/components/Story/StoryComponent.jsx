import React, { useState } from 'react';
import AddStory from './AddStory';
import DisplayStories from "./DisplayStory";

const storiesData = [
    // ... (Keep the existing storiesData here)
];

const StoryApp = () => {
    const [stories, setStories] = useState(storiesData);

    const markAsRead = (story) => {
        setStories(prevStories => prevStories.map(s => s === story ? { ...s, isRead: true } : s));
    };

    const addStory = (newStory) => {
        setStories(prev => [...prev, newStory]);
    };

    return (
        <div className="flex">
            <div className="w-full rounded-2xl bg-gradient-to-r from-violet-400 to-gray-800 text-white p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Statut</h2>
                <div className='flex gap-4'>
                    <AddStory onAddStory={addStory} />
                    <DisplayStories stories={stories} markAsRead={markAsRead} />
                </div>
            </div>
        </div>
    );
};

export default StoryApp;