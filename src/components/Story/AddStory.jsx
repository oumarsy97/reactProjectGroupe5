import React, { useState, useRef } from 'react';

const AddStory = ({ onAddStory }) => {
    const [isNewStoryModalOpen, setIsNewStoryModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [storyMessage, setStoryMessage] = useState("");
    const fileInputRef = useRef(null);

    const addNewStory = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files.map(file => URL.createObjectURL(file)));
        setIsNewStoryModalOpen(true);
    };

    const handleStorySubmit = () => {
        const newStory = {
            userName: "Vous",
            userImage: "ousseynouODC.jpeg",
            images: selectedFiles,
            messages: [storyMessage],
            views: 0,
            isRead: false,
        };
        onAddStory(newStory);
        setIsNewStoryModalOpen(false);
        setSelectedFiles([]);
        setStoryMessage("");
    };

    return (
        <>
            <div className="flex items-center mb-6 cursor-pointer border-r p-2" onClick={addNewStory}>
                <div className="relative">
                    <img src="ousseynouODC.jpeg" alt="Your status" className="w-14 h-14 rounded-full" />
                    <button className="absolute bottom-0 right-0 bg-teal-500 rounded-full px-2">
                        <span>+</span>
                    </button>
                </div>
                <div className="ml-4">
                    <p className="font-semibold">Mon statut</p>
                    <p className="text-gray-400 text-sm">Appuyez sur + pour</p>
                    <p className="text-gray-400 text-sm">ajouter un statut</p>
                </div>
            </div>

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
                    <div className="bg-white p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">Ajouter un nouveau statut</h2>
                        <div className="flex flex-col mb-4">
                            {selectedFiles.map((file, index) => (
                                <img key={index} src={file} alt="Prévisualisation" className="mb-2 rounded" />
                            ))}
                        </div>
                        <textarea
                            className="border p-2 w-full"
                            placeholder="Ajouter un commentaire..."
                            value={storyMessage}
                            onChange={(e) => setStoryMessage(e.target.value)}
                        />
                        <div className="flex justify-end mt-4">
                            <button className="bg-teal-500 text-white px-4 py-2 rounded" onClick={handleStorySubmit}>Publier</button>
                            <button className="bg-gray-400 text-white px-4 py-2 rounded ml-2" onClick={() => setIsNewStoryModalOpen(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddStory;