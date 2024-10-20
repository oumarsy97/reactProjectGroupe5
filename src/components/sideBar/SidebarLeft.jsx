import React from 'react';
import { Users, Scissors, Eye, ShoppingBag } from 'lucide-react';
import ProfileCard from "../UserProfile/ProfilCard";
import { useAuth } from '../../context/AuthContext';
import { useActor } from "../../context/ActorContext";
import { useNavigate } from 'react-router-dom';

const StatsCard = ({ icon: Icon, title, value }) => (
    <div className="flex items-center p-3 bg-gray-800 rounded-lg hover:bg-purple-900 transition-colors duration-300">
        <div className="mr-4 bg-purple-700 p-2 rounded-full">
            <Icon className="w-5 h-5 text-purple-200" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <p className="text-lg font-semibold text-white">{value}</p>
        </div>
    </div>
);

const SidebarLeft = () => {
    const { user } = useAuth();
    const { actor } = useActor();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <div className="col-span-3">
            <div className="bg-gradient-to-b from-black to-purple-900 rounded-xl shadow-lg p-6 sticky top-24 border border-purple-600">
                <ProfileCard />
                <div className="mt-6 space-y-4">
                    <StatsCard icon={Users} title="Abonnés" value={actor?.follow?.length || 0} />
                    <StatsCard icon={Eye} title="Suivi(e)s" value={user?.follow?.length || 0} />
                    {user?.role === 'TAILOR' && (
                        <StatsCard icon={Scissors} title="Mes Créations" value={actor?.posts?.length || 0} />
                    )}
                    {user?.role === 'VENDOR' && (
                        <StatsCard
                            icon={ShoppingBag}
                            title="Mes Produits"
                            value={actor?.produits?.length || 0}
                        />
                    )}
                </div>
                <button
                    className="w-full mt-6 bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:from-purple-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105"
                    onClick={() => navigate("/profile")}
                >
                    Voir mon profil
                </button>
            </div>
        </div>
    );
};

export default SidebarLeft;