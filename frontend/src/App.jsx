import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Threats from './pages/Threats';
import AttackSimulation from './pages/AttackSimulation';
import ResponseEngine from './pages/ResponseEngine';
import ThreatIntel from './pages/ThreatIntel';
import Layout from './components/Layout';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Basic Route Guard
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen bg-[#050914] flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-t-2 border-[#00f0ff] border-r-2 border-transparent animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/auth" replace />;
    return children;
};

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Marketing */}
                    <Route path="/" element={<LandingPage />} />
                    
                    {/* Auth */}
                    <Route path="/auth" element={<AuthPage />} />
                    
                    {/* Secure SaaS App Ring */}
                    <Route path="/app" element={
                        <ProtectedRoute>
                            <NotificationProvider>
                                <Layout />
                            </NotificationProvider>
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="dashboard" />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="logs" element={<Logs />} />
                        <Route path="threats" element={<Threats />} />
                        <Route path="simulation" element={<AttackSimulation />} />
                        <Route path="response" element={<ResponseEngine />} />
                        <Route path="intel" element={<ThreatIntel />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}
