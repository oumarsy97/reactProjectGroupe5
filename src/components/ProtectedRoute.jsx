import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Utilisez votre contexte d'authentification

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth(); // Ajoutez un état de chargement si nécessaire

    // Si l'état d'authentification est encore en cours de chargement, ne redirigez pas encore
    if (loading) {
        return <div>Chargement...</div>; // Ou affichez un spinner/loader
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // Redirigez vers la page de connexion si non authentifié
    }

    return children; // Rendre l'enfant si authentifié
};

export default ProtectedRoute;
