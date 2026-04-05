import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShieldCheck, LayoutGrid, Brain, Target, Globe, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';

export default function Sidebar({ isCollapsed, isMobileOpen, setIsMobileOpen }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        if (logout) logout();
        else {
            localStorage.removeItem('zeroshield_token');
            localStorage.removeItem('zeroshield_user');
        }
        navigate('/');
    };

    const linkClasses = ({ isActive }) => 
        `group relative flex items-center py-3.5 rounded-xl transition-all text-[15px] font-medium ${
            isActive 
                ? 'bg-white/[0.04] text-[#0ea5e9]' 
                : 'text-slate-300 hover:bg-white/[0.02] hover:text-white border border-transparent'
        } ${isCollapsed ? 'justify-center px-0 mx-2' : 'px-4 gap-4'}`;

    const SidebarItem = ({ to, icon: Icon, label }) => (
        <NavLink to={to} onClick={() => setIsMobileOpen?.(false)} className={linkClasses}>
            <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />
            
            {/* Label (hidden when collapsed) */}
            <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}>
                {label}
            </span>

            {/* Custom Tooltip (visible on hover only when collapsed) */}
            {isCollapsed && (
                <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-slate-700 shadow-xl pointer-events-none">
                    {label}
                </div>
            )}
        </NavLink>
    );

    const sidebarWidth = isCollapsed ? 'md:w-[88px]' : 'md:w-64';
    const mobileTransform = isMobileOpen ? 'translate-x-0' : '-translate-x-full';

    return (
        <div className={`transition-all duration-300 z-50 flex flex-col h-full bg-slate-900/40 backdrop-blur-md border-r border-slate-800/60 font-outfit fixed top-0 bottom-0 left-0 md:relative w-64 ${sidebarWidth} ${mobileTransform} md:translate-x-0`}>
            
            <div className={`p-6 border-b border-slate-800/60 transition-all ${isCollapsed ? 'flex justify-center items-center p-4' : ''}`}>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/app/dashboard')}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.3)] shrink-0">
                        <ShieldCheck className="w-4 h-4 text-slate-950" />
                    </div>
                    
                    <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                        <h2 className="text-base font-bold tracking-tight text-white m-0">ZeroShield</h2>
                        <p className="text-[9px] font-mono text-emerald-400/80 tracking-widest uppercase m-0">Platform</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-1.5 mt-2 overflow-y-auto overflow-x-hidden">
                <SidebarItem to="/app/dashboard" icon={LayoutGrid} label="Dashboard" />
                <SidebarItem to="/app/threats" icon={Brain} label="Threat Detection" />
                <SidebarItem to="/app/simulation" icon={Target} label="Attack Simulation" />
                <SidebarItem to="/app/response" icon={ShieldCheck} label="Response Engine" />
                <SidebarItem to="/app/intel" icon={Globe} label="Threat Intel" />
                <SidebarItem to="/app/logs" icon={FileText} label="Logs & Activity" />
            </nav>

            <div className={`p-4 border-t border-slate-800/60 font-outfit shrink-0 transition-all ${isCollapsed ? 'flex flex-col items-center gap-4' : ''}`}>
                
                {isCollapsed ? (
                    <button 
                        onClick={handleLogout} 
                        className="group relative flex items-center gap-2 p-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 transition-colors rounded-lg focus:outline-none"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-rose-950 text-rose-100 text-xs font-bold rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-rose-900 pointer-events-none">
                            Logout
                        </div>
                    </button>
                ) : (
                    <>
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff] shrink-0 bg-[#00f0ff]/5 rounded">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-white font-medium text-sm truncate">
                                    {user?.name || (user?.email ? user.email.split('@')[0] : 'admin')}
                                </span>
                                <span className="text-slate-500 text-xs font-mono uppercase tracking-wider">
                                    {user?.role || 'USER'}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout} 
                            className="flex items-center justify-center gap-2 px-4 py-2.5 w-full bg-transparent border border-rose-500/50 text-rose-500 hover:bg-rose-500/10 transition-colors text-xs font-bold tracking-[0.2em] rounded-lg focus:outline-none"
                        >
                            <LogOut className="w-4 h-4 shrink-0" /> LOGOUT
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
