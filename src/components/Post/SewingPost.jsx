import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

const PostSwing = ({ post }) => {
    const {
        content,
        createdAt,
        photo,
        video,
        user,
        likes,
        comments,
        tags
    } = post;

    const timeAgo = new Date(createdAt).toLocaleDateString();

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
                <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-rose-400 to-purple-400 p-0.5">
                        <div className="h-full w-full rounded-full relative overflow-hidden bg-white">
                            <img src={user.user.photo} alt="Profile" className="rounded-full" />
                        </div>
                    </div>
                    <div className="ml-4">
                        <h3 className="font-medium">{`${user.user.firstname} ${user.user.lastname}`}</h3>
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

            <div className="media-container">
                {photo && <img src={photo} alt="Post" className="w-full" type="video/mp4" />}
                {video && (
                    <video controls className="w-full">
                        <source src={video} type="video/mp4" />
                        Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                )}
            </div>

            <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <Heart className="h-5 w-5" />
                        <span>{likes.length}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-rose-500 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span>{comments.length}</span>
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

export default PostSwing;