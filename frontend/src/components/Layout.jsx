import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { PanelLeft, Menu, Bell, Wifi, WifiOff } from 'lucide-react';
import Sidebar from './Sidebar';
import NotificationDropdown from './NotificationDropdown';
import { api } from '../services/api';

const HealthStatus = () => {
    const [connected, setConnected] = useState(true);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                await api.get('/health');
                setConnected(true);
            } catch (err) {
                setConnected(false);
            }
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-bold">
            {connected ? (
                <>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-emerald-500 hidden sm:inline-block">Connected</span>
                </>
            ) : (
                <>
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
                    <span className="text-rose-500 hidden sm:inline-block">Offline</span>
                </>
            )}
        </div>
    );
};

export default function Layout() {
    // State management with localStorage persistence
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('zeroshield_sidebar_collapsed');
        return saved === 'true';
    });
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('zeroshield_sidebar_collapsed', isCollapsed);
    }, [isCollapsed]);

    // Accessibility: Keyboard shortcut (Ctrl/Cmd + B)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                setIsCollapsed(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <div className="flex bg-slate-950 text-slate-200 h-screen w-screen overflow-hidden font-outfit relative">
            <Sidebar 
                isCollapsed={isCollapsed} 
                isMobileOpen={isMobileOpen} 
                setIsMobileOpen={setIsMobileOpen} 
            />
            
            <main className="flex-1 overflow-hidden relative flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-950 pointer-events-none z-0"></div>
                
                {/* Topbar Navigation */}
                <div className="relative z-10 flex flex-row items-center justify-between p-4 border-b border-white/[0.05] bg-[#0a0f1c] min-h-[64px]">
                    
                    {/* Toggle Button Container */}
                    <div className="flex items-center gap-4">
                        {/* Desktop Toggle Button */}
                        <button 
                            onClick={toggleSidebar}
                            title="Toggle Sidebar (Ctrl+B)"
                            className="hidden md:flex p-1.5 rounded-md border border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
                        >
                            <PanelLeft className="w-5 h-5" />
                        </button>
                        
                        {/* Mobile Toggle Button */}
                        <button 
                            onClick={() => setIsMobileOpen(true)}
                            className="flex md:hidden p-1.5 rounded-md border border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Right aligned status & notifications */}
                    <div className="flex items-center gap-6">
                        <HealthStatus />
                        <NotificationDropdown />
                    </div>

                </div>

                {/* Content Area */}
                <div className="relative z-10 flex-1 overflow-y-auto w-full h-full">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Sidebar Overlay overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-[#050914]/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </div>
    );
}
