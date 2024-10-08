import {useAuth} from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth(); // Récupérer l'utilisateur à partir du contexte Auth

    return (
        <div>
            <h1>Bienvenue sur le tableau de bord</h1>
            <p>Utilisateur actuel: {user.email}</p>

        </div>
    );
};


export default Dashboard;