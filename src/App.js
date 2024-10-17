import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { UserProvider } from './context/AuthContext';
import { TokenProvider } from './context/TokenContext';
import { ActorProvider } from './context/ActorContext';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './components/UserProfile/UserProfil';
import SewingNetwork from './components/Accueil';
import MessagesPage from './components/Messages/MessagesPage';
const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ActorProvider>
                <TokenProvider>
                    <UserProvider>
                        <Router>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <UserProfile />
                                    </ProtectedRoute>
                                } />
                                <Route path="/" element={
                                    <ProtectedRoute>
                                        <SewingNetwork />
                                    </ProtectedRoute>
                                } />
                                <Route path="/messages" element={
                                    <ProtectedRoute>
                                        <MessagesPage />
                                    </ProtectedRoute>
                                } />
                            </Routes>
                        </Router>
                    </UserProvider>
                </TokenProvider>
            </ActorProvider>
        </QueryClientProvider>
    );
}

export default App;