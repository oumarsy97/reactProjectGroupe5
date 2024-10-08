import React from 'react';

const NavItem = ({ icon, text }) => (
    <button className="flex flex-col items-center text-gray-600 hover:text-rose-500 transition-colors">
        <div className="h-6 w-6">{icon}</div>
        <span className="text-xs mt-1">{text}</span>
    </button>
);

export default NavItem;
