import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

const SewingPost = ({ username, timeAgo, content, tags, likes, comments, mediaUrl,mediaProfil, mediaType, }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-0.5">
                        <div className="h-full w-full rounded-full bg-white p-0.5">
                            <img src={mediaProfil} alt="Profile" className="rounded-full" />
                        </div>
                    </div>
                    <div className="ml-4">
                        <h3 className="font-medium">{username}</h3>
                        <p className="text-gray-500 text-sm">{timeAgo}</p>
                    </div>
                </div>
                <p className="mt-4">{content}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Affichage de l'image ou de la vidéo selon le type de média */}
            <div className="media-container">
                {mediaType === 'image' ? (
                    <img src={mediaUrl} alt="Création" className="w-full" />
                ) : mediaType === 'video' ? (
                    <video controls className="w-full">
                        <source src={mediaUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : null}
            </div>

            <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Heart className="h-5 w-5" />
                        <span>{likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span>{comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Share2 className="h-5 w-5" />
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Bookmark className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SewingPost;
