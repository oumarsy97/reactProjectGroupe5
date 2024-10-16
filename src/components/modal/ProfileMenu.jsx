// ProfileMenu.js
import React from 'react';
import { User, LogOut } from 'lucide-react';

const ProfileMenu = ({ isOpen, onClose, onViewProfile, onLogout, userPhoto }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button
                onClick={onViewProfile}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
                <User size={16} className="mr-2" />
                View Profile
            </button>
            <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
                <LogOut size={16} className="mr-2" />
                Logout
            </button>
        </div>
    );
};

export default ProfileMenu;