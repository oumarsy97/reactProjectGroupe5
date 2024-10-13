import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, X, Camera, Smile, Play, Pause, ImagePlus, Star, Heart, Bookmark, Share2, Grid, ThumbsUp, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const ChatApp = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [showStories, setShowStories] = useState(false);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [storyProgress, setStoryProgress] = useState(0);
    const storyTimeout = useRef(null);
    const [allStories, setAllStories] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const recordingInterval = useRef(null);
    const fileInputRef = useRef(null);
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Marie Dupont',
            status: 'en ligne',
            image: 'ousseynouODC.jpeg',
            stories: [
                { id: 1, content: 'WhatsApp Image 2024-10-09 at 09.01.41.jpeg', duration: 5, viewed: false },
                { id: 2, content: 'WhatsApp Image 2024-06-30 at 00.26.33.jpeg', duration: 5, viewed: false }
            ],
            personalInfo: {
                address: "Paris, France",
                phone: "+33 6 12 34 56 78",
                email: "marie.dupont@email.com",
                bio: "Passionnée de photographie et de voyage ✈️ | Designer UI/UX 🎨",
                profileImage: "ousseynouODC.jpeg"
            },
            stats: {
                likes: 15420,
                followers: 2345,
                following: 867,
                rating: 4.8,
                reviews: 127
            },
            posts: [
                { id: 1, type: 'image', url: '/api/placeholder/200/200', likes: 234 },
                { id: 2, type: 'image', url: '/api/placeholder/200/200', likes: 456 },
                { id: 3, type: 'image', url: '/api/placeholder/200/200', likes: 789 }
            ],
            liked: [
                { id: 4, type: 'image', url: '/api/placeholder/200/200', likes: 123 },
                { id: 5, type: 'image', url: '/api/placeholder/200/200', likes: 345 }
            ],
            saved: [
                { id: 6, type: 'image', url: '/api/placeholder/200/200', likes: 567 },
                { id: 7, type: 'image', url: '/api/placeholder/200/200', likes: 890 }
            ],
            shared: [
                { id: 8, type: 'image', url: '/api/placeholder/200/200', likes: 234 },
                { id: 9, type: 'image', url: '/api/placeholder/200/200', likes: 567 }
            ]
        }
    ]);

    const usersWithUnviewedStories = users.filter(user =>
        user.stories.some(story => !story.viewed)
    );

    const handleStoryEnd = () => {
        const currentUser = users[currentUserIndex];
        markStoryAsViewed(currentUser.id, currentUser.stories[currentStoryIndex].id);

        if (currentStoryIndex < currentUser.stories.length - 1) {
            // Move to the next story of the current user
            setCurrentStoryIndex(prev => prev + 1);
            startStoryTimer(currentUser.stories[currentStoryIndex + 1].duration);
        } else {
            // All stories of the current user have been viewed
            const nextUserWithStories = users.findIndex((user, index) =>
                index > currentUserIndex && user.stories.length > 0
            );

            if (nextUserWithStories !== -1) {
                // Move to the next user's stories
                setCurrentUserIndex(nextUserWithStories);
                setCurrentStoryIndex(0);
                startStoryTimer(users[nextUserWithStories].stories[0].duration);
            } else {
                // All stories have been viewed
                handleStoryClose();
            }
        }
    };

    const startStoryTimer = (duration) => {
        clearTimeout(storyTimeout.current);
        setStoryProgress(0);
        const intervalTime = 100; // Update progress every 100ms
        const steps = duration * 1000 / intervalTime;
        let currentStep = 0;

        const updateProgress = () => {
            currentStep++;
            setStoryProgress((currentStep / steps) * 100);

            if (currentStep < steps) {
                storyTimeout.current = setTimeout(updateProgress, intervalTime);
            } else {
                handleStoryEnd();
            }
        };

        updateProgress();
    };

    const handleStoryClick = (userIndex) => {
        setCurrentUserIndex(userIndex);
        setCurrentStoryIndex(0);
        setShowStories(true);
        const firstUnviewedStoryIndex = users[userIndex].stories.findIndex(story => !story.viewed);
        setCurrentStoryIndex(firstUnviewedStoryIndex !== -1 ? firstUnviewedStoryIndex : 0);
        startStoryTimer(users[userIndex].stories[firstUnviewedStoryIndex !== -1 ? firstUnviewedStoryIndex : 0].duration);
    };

    const handleStoryClose = () => {
        setShowStories(false);
        setCurrentStoryIndex(0);
        setCurrentUserIndex(0);
        clearTimeout(storyTimeout.current);
    };

    const handleNextStory = () => {
        clearTimeout(storyTimeout.current);
        handleStoryEnd();
    };

    const handlePreviousStory = () => {
        clearTimeout(storyTimeout.current);
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
            startStoryTimer(users[currentUserIndex].stories[currentStoryIndex - 1].duration);
        } else if (currentUserIndex > 0) {
            const previousUserIndex = users.slice(0, currentUserIndex).findLastIndex(user => user.stories.length > 0);
            if (previousUserIndex !== -1) {
                const previousUser = users[previousUserIndex];
                setCurrentUserIndex(previousUserIndex);
                setCurrentStoryIndex(previousUser.stories.length - 1);
                startStoryTimer(previousUser.stories[previousUser.stories.length - 1].duration);
            }
        }
    };

    const markStoryAsViewed = (userId, storyId) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId
                    ? {
                        ...user,
                        stories: user.stories.map(story =>
                            story.id === storyId ? { ...story, viewed: true } : story
                        )
                    }
                    : user
            )
        );
    };

    useEffect(() => {
        return () => {
            clearTimeout(storyTimeout.current);
        };
    }, []);

    useEffect(() => {
        const stories = users.flatMap(user =>
            user.stories.map(story => ({ ...story, userId: user.id, userName: user.name }))
        );
        setAllStories(stories);
    }, [users]);

    useEffect(() => {
        if (isRecording) {
            recordingInterval.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (recordingInterval.current) {
                clearInterval(recordingInterval.current);
            }
        };
    }, [isRecording]);

    const startRecording = () => {
        setIsRecording(true);
        setRecordingDuration(0);
    };

    const stopRecording = (send = true) => {
        clearInterval(recordingInterval.current);
        setIsRecording(false);
        if (send && recordingDuration > 0) {
            handleSendMessage('audio');
        }
        setRecordingDuration(0);
    };

    const handleSendMessage = (type = 'text', content = null) => {
        if ((!newMessage.trim() && type === 'text') || !selectedUser) return;
        let messageContent = content;
        if (type === 'text') {
            messageContent = newMessage;
        } else if (type === 'audio') {
            messageContent = `🎤 Message vocal (${recordingDuration}s)`;
        }
        setMessages(prev => ({
            ...prev,
            [selectedUser.id]: [
                ...(prev[selectedUser.id] || []),
                {
                    id: Date.now(),
                    content: messageContent,
                    type,
                    timestamp: new Date().toLocaleTimeString(),
                    sender: 'me'
                }
            ]
        }));
        setNewMessage('');
    };

    const ProfilePanel = ({ user, onClose }) => (
        <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${showProfile ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Profil</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <div className="text-center mb-8">
                    <img
                        src={user.personalInfo.profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
                    <p className="text-gray-600 mb-4">{user.personalInfo.bio}</p>

                    <div className="space-y-2 text-left">
                        <p className="text-sm"><span className="font-semibold">Email:</span> {user.personalInfo.email}</p>
                        <p className="text-sm"><span className="font-semibold">Téléphone:</span> {user.personalInfo.phone}</p>
                        <p className="text-sm"><span className="font-semibold">Adresse:</span> {user.personalInfo.address}</p>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-8 text-center">
                    <div className="space-y-1">
                        <Heart size={20} className="mx-auto text-red-500" />
                        <div className="text-sm font-semibold">{user.stats.likes.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Likes</div>
                    </div>
                    <div className="space-y-1">
                        <Users size={20} className="mx-auto text-blue-500" />
                        <div className="text-sm font-semibold">{user.stats.followers.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Abonnés</div>
                    </div>
                    <div className="space-y-1">
                        <Users size={20} className="mx-auto text-green-500" />
                        <div className="text-sm font-semibold">{user.stats.following.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Abonnements</div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-center text-yellow-400">
                            <Star size={20} fill="currentColor" />
                        </div>
                        <div className="text-sm font-semibold">{user.stats.rating}</div>
                        <div className="text-xs text-gray-500">{user.stats.reviews} avis</div>
                    </div>
                </div>

                <div className="border-b mb-4">
                    <div className="flex justify-between">
                        <button
                            className={`px-4 py-2 ${activeTab === 'posts' ? 'border-b-2 border-blue-500' : ''}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            <Grid size={20} />
                        </button>
                        <button
                            className={`px-4 py-2 ${activeTab === 'liked' ? 'border-b-2 border-blue-500' : ''}`}
                            onClick={() => setActiveTab('liked')}
                        >
                            <Heart size={20} />
                        </button>
                        <button
                            className={`px-4 py-2 ${activeTab === 'saved' ? 'border-b-2 border-blue-500' : ''}`}
                            onClick={() => setActiveTab('saved')}
                        >
                            <Bookmark size={20} />
                        </button>
                        <button
                            className={`px-4 py-2 ${activeTab === 'shared' ? 'border-b-2 border-blue-500' : ''}`}
                            onClick={() => setActiveTab('shared')}
                        >
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {user[activeTab].map(item => (
                        <div key={item.id} className="relative group">
                            <img
                                src={item.url}
                                alt=""
                                className="w-full h-40 object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex items-center text-white">
                                    <Heart size={16} className="mr-1" fill="currentColor" />
                                    <span>{item.likes}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleSendMessage('image', {
                    url: reader.result,
                    caption: ''
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <div className="w-1/3 bg-white border-r border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold">Messages</h1>
                </div>
                <div className="p-4 border-b border-gray-200">
                    <div className="flex space-x-4 overflow-x-auto">
                        {users.map((user, index) => (
                            <div
                                key={user.id}
                                className="flex flex-col items-center cursor-pointer"
                                onClick={() => handleStoryClick(index)}
                            >
                                <div className={`rounded-full ${user.stories.some(story => !story.viewed)
                                    ? 'p-0.5 bg-gradient-to-tr from-yellow-400 to-pink-500'
                                    : 'p-0.5 bg-gray-300'
                                }`}>
                                    <div className="p-0.5 bg-white rounded-full">
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                                <span className="text-xs mt-1 truncate w-16 text-center">{user.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="overflow-y-auto">
                    {users.map(user => (
                        <div
                            key={user.id}
                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${selectedUser?.id === user.id ? 'bg-gray-100' : ''}`}
                            onClick={() => setSelectedUser(user)}
                        >
                            <img
                                src={user.image}
                                alt={user.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="ml-4">
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b border-gray-200 bg-white cursor-pointer hover:bg-gray-50" onClick={() => setShowProfile(true)}>
                            <div className="flex items-center ">
                                <img
                                    src={selectedUser.image}
                                    alt={selectedUser.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="ml-4">
                                    <h2 className="font-semibold">{selectedUser.name}</h2>
                                    <p className="text-sm text-gray-500">{selectedUser.status}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')"}}>
                            {messages[selectedUser.id]?.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex mb-4 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`rounded-lg p-3 max-w-xs ${message.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-white'
                                    }`}>
                                        {message.type === 'audio' ? (
                                            <div className="flex items-center space-x-2">
                                                <Play size={16} />
                                                <div className="w-32 h-2 bg-gray-200 rounded-full" />
                                                <span className="text-xs">{message.content}</span>
                                            </div>
                                        ) : message.type === 'image' ? (
                                            <div>
                                                <img src={message.content.url} alt="Image envoyée" className="rounded-lg max-w-xs" />
                                                {message.content.caption && (
                                                    <p className="mt-2 text-sm">{message.content.caption}</p>
                                                )}
                                            </div>
                                        ) : (
                                            message.content
                                        )}
                                        <div className="text-xs mt-1 opacity-70">
                                            {message.timestamp}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-center space-x-4">
                                <button
                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImagePlus size={24} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                                <button
                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <Smile size={24} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Écrivez un message..."
                                    className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage('text')}
                                />
                                {isRecording ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-red-500">{recordingDuration}s</span>
                                        <button
                                            className="p-2 text-red-500 hover:bg-gray-100 rounded-full"
                                            onClick={() => stopRecording(false)}
                                        >
                                            <X size={24} />
                                        </button>
                                        <button
                                            className="p-2 text-blue-500 hover:bg-gray-100 rounded-full"
                                            onClick={() => stopRecording(true)}
                                        >
                                            <Send size={24} />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                        onClick={newMessage.trim() ? () => handleSendMessage('text') : startRecording}
                                    >
                                        {newMessage.trim() ? <Send size={24} /> : <Mic size={24} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <p className="text-gray-500">Sélectionnez une conversation pour commencer</p>
                    </div>
                )}
            </div>
            <ProfilePanel
                user={selectedUser || users[0]}
                onClose={() => setShowProfile(false)}
            />
            {showStories && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <button
                        className="absolute top-4 right-4 text-white z-10"
                        onClick={handleStoryClose}
                    >
                        <X size={24} />
                    </button>
                    <button
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10"
                        onClick={handlePreviousStory}
                    >
                        <ChevronLeft size={36} />
                    </button>
                    <button
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10"
                        onClick={handleNextStory}
                    >
                        <ChevronRight size={36} />
                    </button>
                    <div className="relative">
                        <img
                            src={users[currentUserIndex].stories[currentStoryIndex].content}
                            alt="Story"
                            className="max-h-[80vh] w-auto"
                        />
                        <div className="absolute top-0 left-0 right-0 flex space-x-1 p-2">
                            {users[currentUserIndex].stories.map((story, index) => (
                                <div
                                    key={story.id}
                                    className="flex-1 h-1 bg-gray-500 bg-opacity-50 rounded overflow-hidden"
                                >
                                    <div
                                        className="h-full bg-white rounded"
                                        style={{
                                            width: index === currentStoryIndex ? `${storyProgress}%` : index < currentStoryIndex ? '100%' : '0%',
                                            transition: 'width 0.1s linear'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showEmojiPicker && (
                <div className="absolute bottom-20 left-1/3 bg-white rounded-lg shadow-lg p-4">
                    <div className="grid grid-cols-6 gap-2">
                        {['😊', '😂', '❤️', '👍', '🎉', '🔥', '😎', '🤔', '👋', '🙌', '💪', '🌟'].map(emoji => (
                            <button
                                key={emoji}
                                className="text-2xl hover:bg-gray-100 p-2 rounded"
                                onClick={() => {
                                    setNewMessage(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                }}
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <style jsx>{`
        @keyframes progressBar {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
        </div>
    );
};

export default ChatApp;