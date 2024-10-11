import React from 'react';
import { Users, Scissors, Eye,ShoppingBag } from 'lucide-react';
import ProfileCard from "../UserProfile/ProfilCard";
import { useAuth } from '../../context/AuthContext';
import { useActor } from "../../context/ActorContext";
import { useNavigate } from 'react-router-dom';

const StatsCard = ({ icon: Icon, title, value }) => (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-violet-50 transition-colors duration-300">
        <div className="mr-4 bg-violet-100 p-2 rounded-full">
            <Icon className="w-5 h-5 text-violet-600" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-lg font-semibold text-gray-800">{value}</p>
        </div>
    </div>
);

const SidebarLeft = () => {
    const { user } = useAuth();
    const { actor } = useActor();
    const navigate = useNavigate();

    return (
        <div className="col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-200">
                <ProfileCard />
                <div className="mt-6 space-y-4">
                    <StatsCard icon={Users} title="Abonnés" value={actor?.follow?.length || 0} />
                    <StatsCard icon={Eye} title="Suivi(e)s" value={actor?.following?.length || 0} />
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
                    className="w-full mt-6 bg-gradient-to-r from-violet-400 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold shadow-md hover:from-violet-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                    onClick={() => navigate("/profile")}
                >
                    Voir mon profil
                </button>

            </div>
        </div>
    );
};

export default SidebarLeft;