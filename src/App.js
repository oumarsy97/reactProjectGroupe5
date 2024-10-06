// src/App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
//import Dashboard from './components/Dashboard'; // Exemple de composant protégé
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from "./components/UserProfile";
import Dashboard from "./components/Dashboard";
import Home from "./components/HomePage";
import HomePage from "./components/HomePage";
import SewingNetwork from "./components/Accueil";
//import UserProfile from "./components/UserProfile";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} /> {/* Redirection vers la page de connexion */}


                    <Route path="/profile" element={
                            <ProtectedRoute>
                                <UserProfile />
                            </ProtectedRoute>
                        }
                    />
                     <Route path="/home" element={
                            <ProtectedRoute>
                                <SewingNetwork/>
                            </ProtectedRoute>
                        } />



                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
