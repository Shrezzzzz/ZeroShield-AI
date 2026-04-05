import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell, ShieldAlert, Cpu, Activity, Info, X, CheckCheck, Trash2, ChevronRight } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, getIcon } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const getSeverityClasses = (severity, read) => {
        if (read) return 'border-transparent bg-white/[0.02] opacity-70 hover:opacity-100 hover:bg-white/[0.04]';
        switch (severity) {
            case 'critical': return 'border-rose-500/50 bg-rose-500/10 hover:bg-rose-500/20 shadow-[0_8px_32px_rgba(244,63,94,0.15)]';
            case 'warning': return 'border-[#00f0ff]/30 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 shadow-[0_8px_32px_rgba(0,240,255,0.1)]'; // mapping Warning/Simulation
            case 'system': return 'border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 shadow-[0_8px_32px_rgba(16,185,129,0.1)]';
            default: return 'border-white/[0.08] bg-[rgba(30,35,50,0.6)] hover:bg-[rgba(40,45,65,0.7)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]';
        }
    };

    const getSquircleColors = (type, severity) => {
        if (severity === 'critical') return 'bg-rose-500/20 text-rose-500';
        if (type === 'simulation') return 'bg-[#00f0ff]/20 text-[#00f0ff]';
        if (type === 'system') return 'bg-emerald-500/20 text-emerald-500';
        return 'bg-white/10 text-white';
    };

    const formatRelativeTime = (timestamp) => {
        const diff = Math.floor((new Date() - new Date(timestamp)) / 60000);
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff} min${diff === 1 ? '' : 'm'}`;
        const hours = Math.floor(diff / 60);
        if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'}`;
        return new Date(timestamp).toLocaleDateString();
    };

    const unreadNotifs = notifications.filter(n => !n.read);
    const readNotifs = notifications.filter(n => n.read);

    const NotificationItem = ({ notif }) => (
        <div 
            key={notif.id}
            onClick={() => markAsRead(notif.id)}
            className={`relative p-4 mb-3 rounded-[20px] border cursor-pointer transition-all duration-300 backdrop-blur-xl ${getSeverityClasses(notif.severity, notif.read)} group`}
            style={{ backdropFilter: 'blur(10px)' }}
        >
            <div className="flex gap-4">
                {/* Squircle Icon */}
                <div className={`shrink-0 w-10 h-10 rounded-[12px] flex items-center justify-center shadow-inner ${getSquircleColors(notif.type, notif.severity)}`}>
                    {getIcon ? getIcon(notif.type, 'none') : <Info className="w-5 h-5" />}
                </div>

                <div className="flex flex-col flex-1 gap-1 min-w-0 justify-center">
                    <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-[15px] font-semibold truncate ${notif.read ? 'text-white/70' : 'text-white'}`}>{notif.title}</h4>
                        <span className="text-xs font-medium text-white/40 shrink-0 whitespace-nowrap mt-0.5">
                            {formatRelativeTime(notif.timestamp)}
                        </span>
                    </div>
                    <p className="text-[13px] text-white/70 leading-snug break-words pr-4">
                        {notif.message}
                    </p>

                    {/* Interactive elements (optional injection for System) */}
                    {notif.severity === 'info' && notif.title.includes('Report') && (
                        <div className="flex gap-2 mt-3 mb-1">
                            <button className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors border border-white/[0.05]">
                                View Report
                            </button>
                            <button className="px-3 py-1.5 rounded-full bg-transparent hover:bg-white/5 text-xs font-semibold text-white/60 hover:text-white transition-colors border border-transparent">
                                Dismiss
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Hover X */}
            {!notif.read && (
                <button 
                    className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 shadow-sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notif.id);
                    }}
                    title="Mark as read"
                >
                    <CheckCheck className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    );

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-md border border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50 hover:border-slate-700/50 transition-colors focus:outline-none focus:ring-1 focus:ring-[#00f0ff]"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <>
                        <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white border-2 border-[#0a0f1c] z-10 scale-110">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 shrink-0 rounded-full bg-rose-500 opacity-60 animate-ping pointer-events-none"></span>
                    </>
                )}
            </button>

            {/* Render overlay and panel through a portal to avoid parent clipping issues */}
            {isOpen && createPortal(
                <>
                    {/* Sidebar Backdrop Overlay */}
                    <div 
                        className="fixed inset-0 z-[80] transition-opacity bg-black/20"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* macOS Sequoia styled Sidebar Panel */}
                    <div 
                        className={`fixed top-0 right-0 h-full w-[380px] z-[90] flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] translate-x-0`}
                        style={{
                            backgroundColor: 'rgba(15, 20, 35, 0.75)',
                            backdropFilter: 'blur(25px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
                            borderLeft: '1px solid rgba(255, 255, 255, 0.08)'
                        }}
                    >
                        {/* Header Sequence */}
                        <div className="flex items-center justify-between p-5 mt-2 sticky top-0 z-10">
                            <h3 className="text-xl font-bold text-white tracking-tight">Notification Center</h3>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors flex items-center justify-center bg-black/20"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List Container scrollable */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-6 flex flex-col pt-2 no-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/50">
                                    <Bell className="w-12 h-12 mb-4 opacity-30" />
                                    <p className="text-[15px] font-semibold">No notifications</p>
                                </div>
                            ) : (
                                <>
                                    {/* Unread Section simulating Stacked grouping locally */}
                                    {unreadNotifs.length > 0 && (
                                        <div className="pb-2">
                                            <div className="flex items-center justify-between mx-1 mb-3">
                                                <h4 className="text-[13px] font-semibold text-white/70 uppercase tracking-widest">
                                                    New
                                                </h4>
                                                <button onClick={markAllAsRead} className="text-xs font-medium text-[#00f0ff] hover:text-[#00f0ff]/80 transition-colors">
                                                    Mark all as read
                                                </button>
                                            </div>
                                            <div className="flex flex-col">
                                                {/* Artificial stacking visualization application for UX */}
                                                {unreadNotifs.map((n, i) => (
                                                    <NotificationItem 
                                                        key={n.id} 
                                                        notif={n} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Read Section */}
                                    {readNotifs.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="text-[13px] font-semibold text-white/50 uppercase tracking-widest mx-1 mb-3">
                                                Earlier
                                            </h4>
                                            <div className="flex flex-col">
                                                {readNotifs.map((n, i) => (
                                                    <NotificationItem 
                                                        key={n.id} 
                                                        notif={n} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer fixed */}
                        {notifications.length > 0 && (
                            <div className="p-4 flex items-center justify-center mb-2 mx-4 gap-4 sticky bottom-0">
                                <button 
                                    onClick={clearAll}
                                    className="flex-1 py-3 px-4 rounded-[14px] bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm font-semibold transition-all border border-white/[0.05] shadow-lg flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Clear All
                                </button>
                            </div>
                        )}
                    </div>
                </>,
                document.body
            )}
        </div>
    );
}
