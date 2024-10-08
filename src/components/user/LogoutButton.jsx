import { Power } from 'lucide-react';
import {removeToken} from "../../utils/tokenUtils";
import AlertService from "../../services/notifications/AlertService";
import { useNavigate } from 'react-router-dom';



const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        removeToken();
        navigate('/');
        AlertService.success("Vous avez été déconnecté");  // Afficher une notification de déconnexion si la déconnexion est effectuée avec succès
    };

    return (
        <button
            onClick={handleLogout}
            className="p-2 rounded-full flex flex-col items-center "
        >
            <Power size={24} className="text-white  hover:text-red-800" />
           <p>Se déconnecter</p>
        </button>
    );
};

export default LogoutButton;