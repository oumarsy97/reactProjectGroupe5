import { Power } from 'lucide-react';
import AlertService from "../../services/notifications/AlertService";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import {useToken} from "../../context/TokenContext";
import {useActor} from "../../context/ActorContext";

const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Utilisation du contexte d'authentification pour obtenir la fonction logout
    const {setToken} = useToken(); //
    const {setActor} = useActor(); // Utilisation du contexte de l'utilisateur pour obtenir la fonction logout'

    const handleLogout = () => {
        logout();  // Déconnecter l'utilisateur et supprimer le token
        AlertService.success("Vous avez été déconnecté");  // Afficher une notification de déconnexion
        setToken(null);  // Supprimer le token dans le contexte de token
        navigate('/login');  // Redirection vers la page de connexion après déconnexion
        setActor(null);  // Supprimer l'utilisateur dans le contexte de l'utilisateur (pour le cas où il était connecté)
    };

    return (
        <button
            onClick={handleLogout}
            className="p-2 rounded-full flex flex-col items-center"
        >
            <Power size={24} className="text-white hover:text-red-800" />
            <p>Se déconnecter</p>
        </button>
    );
};

export default LogoutButton;
