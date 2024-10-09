// src/App.js
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from "./components/UserProfile/UserProfil";
import SewingNetwork from "./components/Accueil";
import UserList from "./components/user/UserTest";
//import UserProfile from "./components/UserProfile";

function App() {

    return (
        <AuthProvider>
            <Router>

                <Routes>
                    <Route path="/" element={

                        <UserList />

                    } /> {/* Redirection vers la page de connexion */}


                    <Route path="/profile" element={
                            <ProtectedRoute >
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
