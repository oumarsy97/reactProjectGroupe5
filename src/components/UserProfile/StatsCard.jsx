import React from 'react';

const StatsCard = ({ icon, title, value }) => (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-rose-400 to-purple-400 flex items-center justify-center text-white">
            {icon}
        </div>
        <div className="ml-3">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </div>
);

export default StatsCard;
