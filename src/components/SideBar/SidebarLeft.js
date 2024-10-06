import React from 'react';
import { Layout, Users, Star } from 'lucide-react';
import ProfileCard from "../UserProfile/ProfilCard";
import StatsCard from "../UserProfile/StatsCard";
import PostCreation from "../Post/PostCreation";

const SidebarLeft = () => (
    <div className="col-span-3">
        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <ProfileCard name="Marie Couture" specialty="Créatrice Passionnée" />
            <div className="space-y-4">
                <StatsCard icon={<Layout />} title="Mes Créations" value="47" />
                <StatsCard icon={<Users />} title="Abonnés" value="1.2k" />
                <StatsCard icon={<Star />} title="Inspirations" value="230" />
            </div>
            <button className="w-full mt-6 bg-gradient-to-r mb-3 from-rose-400 to-purple-400 text-white py-2 px-4 rounded-full">
                Voir mon profil
            </button>
            <PostCreation />
        </div>
    </div>
);

export default SidebarLeft;
