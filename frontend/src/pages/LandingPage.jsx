import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, Zap, Server, Brain, Lock, Network, ChevronRight, AlertTriangle } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#050914] text-slate-300 font-outfit overflow-x-hidden selection:bg-[#00f0ff]/30">
            {/* Navigation Bar */}
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-[#050914]/80 backdrop-blur-xl border-b border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'py-6 bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#00f0ff] blur-[10px] opacity-40"></div>
                            <Shield className="w-8 h-8 text-[#00f0ff] relative z-10" />
                        </div>
                        <span className="text-xl font-bold text-white font-orbitron tracking-widest">
                            ZEROSHIELD<span className="text-[#00f0ff]">.AI</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
                        <a href="#defense" className="text-slate-400 hover:text-white transition-colors">AI Defense</a>
                        <button onClick={() => navigate('/auth')} 
                                className="px-6 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.1] hover:bg-white/[0.1] hover:border-[#00f0ff]/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all flex items-center gap-2">
                            Sign In
                        </button>
                    </div>
                </div>
            </nav>

            {/* Premium Cyber Grid Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMjQwLCAyNTUsIDAuMTUpIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white_20%,transparent_80%)] opacity-60"></div>
                
                {/* Dynamic Glowing Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00f0ff]/10 blur-[150px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00ff9c]/10 blur-[150px] mix-blend-screen"></div>
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[80%] h-[30%] rounded-full bg-[#ff4d4d]/5 blur-[200px]"></div>
            </div>

            {/* Hero Section */}
            <header className="relative z-10 pt-40 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left z-20">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono mb-8 backdrop-blur-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
                                NEURAL THREAT ENGINE v3.0 ACTIVE
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 font-orbitron tracking-tight leading-[1.1] mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                PROACTIVE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#00ff9c]">AI DEFENSE</span>
                            </h1>
                            
                            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light">
                                Advanced behavioral analysis and real-time threat detection powered by next-generation neural networks. Protect your infrastructure before zero-day vulnerabilities are exploited.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                                <button onClick={() => navigate('/auth')} 
                                        className="group relative px-8 py-4 bg-gradient-to-r from-[#00f0ff] to-[#00b8ff] text-[#050914] font-bold rounded-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto flex justify-center items-center gap-2">
                                    <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-500 ease-in-out"></div>
                                    <span className="font-orbitron tracking-widest text-sm">GET STARTED</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                
                                <button onClick={() => navigate('/auth')} 
                                        className="px-8 py-4 bg-white/[0.02] border border-white/10 text-white font-bold rounded-lg hover:bg-white/[0.08] hover:border-white/20 transition-all backdrop-blur-md w-full sm:w-auto font-orbitron tracking-widest text-sm text-center">
                                    VIEW DASHBOARD
                                </button>
                            </div>
                        </div>

                        {/* Floating Isometric Security UI Mockup */}
                        <div className="flex-1 relative w-full h-[500px] hidden lg:block z-10 perspective-[1000px]">
                            <div className="absolute inset-0 rotate-y-[-15deg] rotate-x-[10deg] animate-[float_6s_ease-in-out_infinite] transform-style-preserve-3d shadow-2xl">
                                {/* Back Glass Pane */}
                                <div className="absolute inset-0 bg-[#0a1128]/80 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col overflow-hidden">
                                    {/* Mock Header */}
                                    <div className="h-12 border-b border-white/[0.05] bg-white/[0.02] flex items-center px-4 gap-4">
                                        <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-rose-500/80"></div><div className="w-3 h-3 rounded-full bg-amber-500/80"></div><div className="w-3 h-3 rounded-full bg-emerald-500/80"></div></div>
                                        <div className="h-6 w-48 bg-white/[0.05] rounded mx-auto"></div>
                                    </div>
                                    {/* Mock Content area */}
                                    <div className="flex-1 p-6 grid grid-cols-2 gap-4">
                                        {/* Chart Card */}
                                        <div className="col-span-2 h-32 rounded-xl border border-white/[0.05] bg-white/[0.02] flex items-end p-4 gap-2 relative overflow-hidden">
                                            <div className="absolute top-4 left-4 text-xs font-mono text-[#00f0ff]">LIVE TRAFFIC ANALYSIS</div>
                                            {[40, 20, 60, 30, 80, 50, 90, 70, 100].map((h, i) => (
                                                <div key={i} className="flex-1 bg-gradient-to-t from-[#00f0ff]/40 to-transparent rounded-t-sm" style={{ height: `${h}%` }}></div>
                                            ))}
                                        </div>
                                        {/* Stat Cards */}
                                        <div className="rounded-xl border border-[#00ff9c]/20 bg-[#00ff9c]/5 p-4 flex flex-col justify-center">
                                            <div className="text-[10px] text-[#00ff9c] font-mono mb-1">THREATS PREVENTED</div>
                                            <div className="text-3xl font-orbitron text-white">1,402</div>
                                        </div>
                                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex flex-col justify-center">
                                            <div className="text-[10px] text-rose-400 font-mono mb-1">CRITICAL ALERTS</div>
                                            <div className="text-3xl font-orbitron text-white flex items-center gap-2"><AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse"/> 3</div>
                                        </div>
                                    </div>
                                </div>
                                {/* Floating Badge Front */}
                                <div className="absolute -bottom-6 -left-6 bg-[#0a1128]/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-[float_4s_ease-in-out_1s_infinite] flex items-center gap-4 z-20">
                                    <div className="w-12 h-12 rounded-full bg-[#00f0ff]/10 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-[#00f0ff]" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-mono">SYSTEM STATUS</div>
                                        <div className="text-emerald-400 font-bold tracking-wider">SECURE</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Problem Statistics Section */}
            <section className="relative z-10 py-24 border-y border-white/[0.02] bg-white/[0.01]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-orbitron tracking-wide mb-6">
                            THE ZERO-DAY <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">PROBLEM</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Traditional signature-based security fails against unknown threats in real-time environments.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { stat: '73%', label: 'Of organizations hit by zero-day exploits annually', color: 'from-rose-500 to-rose-700' },
                            { stat: '$4.5M', label: 'Average cost of a single zero-day data breach', color: 'from-amber-400 to-amber-600' },
                            { stat: '< 24h', label: 'Detection window before lateral damage spreads', color: 'from-rose-500 to-rose-700' }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-[#0a1128]/40 border border-white/[0.05] backdrop-blur-xl hover:bg-white/[0.02] hover:border-white/[0.1] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Brain className="w-32 h-32" />
                                </div>
                                <div className={`text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${item.color} mb-6 font-orbitron drop-shadow-lg`}>
                                    {item.stat}
                                </div>
                                <div className="text-base md:text-lg text-slate-300 leading-relaxed font-medium relative z-10">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Detection Deep Dive */}
            <section id="defense" className="relative z-10 py-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] text-sm font-medium">
                                <Activity className="w-4 h-4" /> ENGINE CAPABILITIES
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white font-orbitron tracking-tight">
                                BEHAVIORAL <br />
                                <span className="text-[#00f0ff]">DETECTION CORE</span>
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                Our proprietary neural networks don't wait for threat signatures. By understanding baseline operational parameters, ZeroShield AI instantly flags and isolates anomalous behaviors mimicking zero-day exploits.
                            </p>
                            
                            <div className="space-y-6 pt-4">
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center shrink-0">
                                        <Zap className="w-6 h-6 text-[#00f0ff]"/>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2 font-orbitron">Real-Time Isolation</h4>
                                        <p className="text-slate-400">Micro-segmentation triggers automatically within milliseconds of detected anomalies, preventing lateral movement.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-12 h-12 rounded-xl bg-[#00ff9c]/10 border border-[#00ff9c]/30 flex items-center justify-center shrink-0">
                                        <Server className="w-6 h-6 text-[#00ff9c]"/>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2 font-orbitron">Infrastructure Agnostic</h4>
                                        <p className="text-slate-400">Deploy across AWS, Azure, GCP, or on-premise hardware seamlessly with zero-downtime integration.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Visual Graph Component */}
                        <div className="flex-1 w-full bg-[#0a1128]/50 border border-white/[0.05] backdrop-blur-2xl rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            
                            {/* Abstract Node Network */}
                            <div className="relative h-[400px] w-full flex items-center justify-center">
                                {/* Central Node */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#00f0ff]/20 border-2 border-[#00f0ff]/50 flex items-center justify-center z-20 shadow-[0_0_30px_rgba(0,240,255,0.4)] animate-[pulse-glow_4s_infinite]">
                                    <Shield className="w-10 h-10 text-[#00f0ff]" />
                                </div>
                                
                                {/* Surrounding Nodes */}
                                {[
                                    { x: -120, y: -80, icon: Lock, color: 'text-slate-300', bg: 'bg-white/5 border-white/20' },
                                    { x: 140, y: -90, icon: Network, color: 'text-slate-300', bg: 'bg-white/5 border-white/20' },
                                    { x: -140, y: 100, icon: Server, color: 'text-slate-300', bg: 'bg-white/5 border-white/20' },
                                    { x: 120, y: 110, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/20 border-rose-500/50', pulse: true }
                                ].map((node, i) => {
                                    const IconNode = node.icon;
                                    return (
                                        <React.Fragment key={i}>
                                            <div className="absolute top-1/2 left-1/2 border border-dashed border-[#00f0ff]/20 z-0 opacity-50" style={{ width: `${Math.abs(node.x)*2}px`, height: `${Math.abs(node.y)*2}px`, transform: 'translate(-50%, -50%)', borderRadius: '50%' }}></div>
                                            <div className={`absolute w-14 h-14 rounded-full ${node.bg} border flex items-center justify-center z-10 backdrop-blur-md ${node.pulse ? 'animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.4)]' : ''}`} style={{ transform: `translate(calc(-50% + ${node.x}px), calc(-50% + ${node.y}px))` }}>
                                                <IconNode className={`w-6 h-6 ${node.color}`} />
                                            </div>
                                        </React.Fragment>
                                    )
                                })}

                                {/* Simulated Attack Line */}
                                <div className="absolute top-1/2 left-1/2 w-32 h-[2px] origin-left rotate-[40deg] translate-x-[60px] translate-y-[55px] z-10 overflow-hidden">
                                     <div className="w-full h-full bg-gradient-to-r from-transparent via-rose-500 to-transparent -translate-x-full animate-[scanline_2s_ease-out_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comprehensive Features Grid */}
            <section id="features" className="relative z-10 py-24 bg-[#0a1128]/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white font-orbitron tracking-wide mb-6">
                            PLATFORM <span className="text-[#00ff9c]">FEATURES</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">A complete toolkit for enterprise-grade security operations.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: 'Threat Intel Feed', desc: 'Global threat data aggregated in real-time across millions of nodes.', icon: Network, color: '#00ff9c' },
                            { title: 'Attack Simulation', desc: 'Securely test your defenses with realistic AI-generated attack vectors.', icon: Zap, color: '#00f0ff' },
                            { title: 'Dynamic Risk Scoring', desc: 'Continuous 0-100 risk assessment mapping your entire infrastructure.', icon: Activity, color: '#ff4d4d' },
                            { title: 'Traffic Analysis', desc: 'Deep packet inspection combined with encrypted payload heuristics.', icon: Server, color: '#00ff9c' },
                            { title: 'API Security', desc: 'Identify and block injection attacks targeting undocumented endpoints.', icon: Lock, color: '#00f0ff' },
                            { title: 'Audit Logging', desc: 'Immutable, cryptographically verifiable logs of all security events.', icon: Brain, color: '#ff4d4d' }
                        ].map((feat, i) => {
                            const IconComponent = feat.icon;
                            return (
                                <div key={i} className="group relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.1] to-white/[0.01] hover:from-[var(--hover-color)] hover:to-white/[0.01] transition-all duration-500" style={{ '--hover-color': `${feat.color}40` }}>
                                    <div className="h-full bg-[#0a1128]/90 backdrop-blur-xl rounded-2xl p-8 transition-colors flex flex-col">
                                        <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center transition-transform group-hover:scale-110 duration-300" style={{ backgroundColor: `${feat.color}15`, color: feat.color, border: `1px solid ${feat.color}30` }}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-xl font-bold mb-3 font-orbitron text-white">
                                            {feat.title}
                                        </h4>
                                        <p className="text-slate-400 leading-relaxed text-sm">
                                            {feat.desc}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
            
            {/* Massive Final CTA */}
            <section className="relative z-10 py-40 border-t border-white/[0.05] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#00f0ff]/10 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[#00f0ff]/5 blur-[200px] pointer-events-none"></div>
                
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold text-white font-orbitron tracking-wide mb-8 drop-shadow-2xl">
                        START PROTECTING YOUR <br/>
                        <span className="text-[#00f0ff]">INFRASTRUCTURE TODAY</span>
                    </h2>
                    <p className="text-xl text-slate-300 mb-12 font-light">
                        Deploy ZeroShield AI in minutes via agentless integration. Gain immediate visibility and autonomous protection for your entire stack.
                    </p>
                    
                    <button onClick={() => navigate('/auth')} 
                            className="group relative px-10 py-5 bg-white text-[#050914] font-bold rounded-xl overflow-hidden transition-all hover:scale-[1.05] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff] to-[#00ff9c] translate-y-[-100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-in-out"></div>
                        <span className="relative z-10 font-orbitron tracking-widest text-lg group-hover:text-[#050914] flex items-center gap-2 justify-center">
                            INITIATE DEPLOYMENT <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </span>
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500 font-mono">
                        <span className="flex items-center gap-2"><Shield className="w-4 h-4"/> No Credit Card Required</span>
                        <span className="flex items-center gap-2"><Server className="w-4 h-4"/> SOC2 Compliant</span>
                    </div>
                </div>
            </section>
            
            {/* Footer */}
            <footer className="relative z-10 py-10 border-t border-white/[0.05] bg-[#050914]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 opacity-50">
                        <Shield className="w-5 h-5 text-white" />
                        <span className="text-sm font-bold text-white font-orbitron tracking-wider">ZEROSHIELD AI</span>
                    </div>
                    <div className="text-slate-500 text-sm">
                        &copy; 2026 ZeroShield Security Systems. All rights reserved.
                    </div>
                    <div className="flex gap-4 text-sm text-slate-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">API</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
