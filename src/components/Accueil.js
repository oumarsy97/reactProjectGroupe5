import React, { useState } from 'react';
import Navbar from "./UserProfile/Navbar";
import SidebarLeft from "./SideBar/SidebarLeft";
import SewingPost from "./Post/SewingPost";
import SidebarRight from "./SideBar/SidebarRight";
import PostCreation from "./Post/PostCreation";

const SewingNetwork = () => {
    const [activeFilter, setActiveFilter] = useState('tendances');

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar/>
            <div className="grid grid-cols-12 gap-8 pt-24 max-w-7xl mx-auto px-4">
                <SidebarLeft />
                <div className="col-span-6 space-y-6">
                    <SidebarRight activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
                    {/* Posts go here */}
                    <SewingPost
                        username="Marie Couture"
                        timeAgo="Il y a 2h"
                        content="Découvrez ma dernière création, une robe vintage inspirée des années 50!"
                        tags={['robe', 'vintage', 'couture']}
                        likes="200"
                        comments="12"
                        mediaUrl="data:image/jpeg;base64,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"
                        mediaType="image"
                    />
                    <SewingPost
                        username="Sophie_Styles"
                        timeAgo="2h" 
                        content="Ma dernière création inspirée de la haute couture parisienne 🧵✨"
                        tags={['HauteCouture', 'CreationOriginal', 'ModeFrançaise']}
                        likes={234}
                        comments={45}
                        mediaUrl="data:image/jpeg;base64,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"
                        mediaType="image" // Peut être 'image' ou 'video'
                    />
                    <SewingPost
                        username="Oumar Sy"
                        timeAgo="Il y a 4h"
                        content="Découvrez ma dernière création, une robe vintage inspirée des années 50!"
                        tags={['robe', 'vintage', 'couture']}
                        likes="205"
                        comments="12"
                    />
                    <SewingPost
                        username="Oumar Sy"
                        timeAgo="Il y a 4h"
                        content="Découvrez ma dernière création, une robe vintage inspirée des années 50!"
                        tags={['robe', 'vintage', 'couture']}
                        likes="205"
                        comments="12"
                    />
                    <SewingPost
                        username="Oumar Sy"
                        timeAgo="Il y a 4h"
                        content="Découvrez ma dernière création, une robe vintage inspirée des années 50!"
                        tags={['robe', 'vintage', 'couture']}
                        likes="205"
                        comments="12"
                    />
                    <SewingPost
                        username="Oumar Sy"
                        timeAgo="Il y a 4h"
                        content="Découvrez ma dernière création, une robe vintage inspirée des années 50!"
                        tags={['robe', 'vintage', 'couture']}
                        likes="205"
                        comments="12"
                    />
                    <SewingPost
                        username="Oumar Sy"
                        timeAgo="Il y a 4h"
                        content="Découvrez ma dernière création, une robe vintage inspirée des années 50!"
                        tags={['robe', 'vintage', 'couture']}
                        likes="205"
                        comments="12"
                    />
                    <SewingPost
                        username="Oumar Sy"
                        timeAgo="Il y a 4h"
                        content="Découvrez ma dernière création, une robe vintage inspirée des années 50!"
                        tags={['robe', 'vintage', 'couture']}
                        likes="205"
                        comments="12"
                    />
                    <SewingPost
                        username="Oumar Sy"
                        timeAgo="Il y a 4h"
                        content="Découvrez ma dernière création, une robe vintage inspirée des années 50!"
                        tags={['robe', 'vintage', 'couture']}
                        likes="205"
                        comments="12"
                    />
                    <SewingPost
                        username="Oumar Sy"
                        timeAgo="Il y a 4h"
                        content="Découvrez ma dernière création, une robe vintage inspirée des années 50!"
                        tags={['robe', 'vintage', 'couture']}
                        likes="205"
                        comments="12"
                    />


                </div>
                /*
                RICHT
                */
            </div>
        </div>
    );
};

export default SewingNetwork;
