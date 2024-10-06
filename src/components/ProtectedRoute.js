import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Utilisez votre contexte d'authentification

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Vérifiez si l'utilisateur est authentifié
    console.log("auth",isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />; //dashboard Redirigez vers la page de connexion si non authentifié
    }

    return children; // Rendre l'enfant si authentifié
};


export default ProtectedRoute;