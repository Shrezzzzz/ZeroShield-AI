import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (isLogin) {
                await login({ email, password });
            } else {
                await register({ name, email, password });
            }
            navigate('/app/dashboard');
        } catch (err) {
            setError(err.message || "Authentication failed");
        }
    };

    const primaryColor = isLogin ? '#00f0ff' : '#00ff9c';

    return (
        <div className="min-h-screen bg-[#050914] flex items-center justify-center p-4 font-outfit relative overflow-hidden selection:bg-[#00f0ff]/30">
            {/* Abstract Background Pattern */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-30">
                <div className={`w-[120%] h-[120%] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_25%,rgba(255,255,255,0.03)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.03)_75%,rgba(255,255,255,0.03)_100%)] bg-[length:100px_100px] animate-[scanline_20s_linear_infinite]`} style={{ color: primaryColor, filter: `drop-shadow(0 0 10px ${primaryColor}40)` }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20" style={{ backgroundColor: primaryColor }}></div>
            </div>

            <div className="w-full max-w-[420px] bg-[#0c1322] border border-white/[0.05] p-10 relative z-10 shadow-2xl">
                
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield className="w-8 h-8" style={{ color: primaryColor }} />
                        <span className="text-2xl font-bold font-orbitron tracking-widest text-[#00f0ff]" style={{ color: primaryColor }}>
                            ZEROSHIELD AI
                        </span>
                    </div>
                    <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-400">
                        {isLogin ? 'SYSTEM ACCESS' : 'REGISTER ACCESS'}
                    </h2>
                </div>

                {error && <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {!isLogin && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">NAME</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input type="text" required value={name} onChange={e=>setName(e.target.value)} 
                                       className="w-full bg-[#050914] border border-white/[0.05] py-3 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-white/[0.1] transition-all text-sm font-medium" 
                                       placeholder="Enter your name" />
                            </div>
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">EMAIL</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} 
                                   className="w-full bg-[#050914] border border-white/[0.05] py-3 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-white/[0.1] transition-all text-sm font-medium" 
                                   placeholder="Enter your email" />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PASSWORD</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} 
                                   className="w-full bg-[#050914] border border-white/[0.05] py-3 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-white/[0.1] transition-all text-sm font-medium" 
                                   placeholder="Enter your password" />
                        </div>
                    </div>

                    <button type="submit" className="mt-4 w-full py-3.5 bg-transparent text-white font-bold tracking-widest text-sm transition-all shadow-lg hover:bg-white/[0.02]"
                            style={{ border: `1px solid ${primaryColor}`, textShadow: `0 0 10px ${primaryColor}80`, boxShadow: `inset 0 0 15px ${primaryColor}15, 0 0 15px ${primaryColor}15` }}>
                        {isLogin ? 'ACCESS SYSTEM' : 'REGISTER'}
                    </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-6">
                    <p className="text-sm text-slate-400">
                        {isLogin ? "Don't have access? " : "Already have access? "}
                        <button onClick={() => setIsLogin(!isLogin)} className="hover:underline transition-colors focus:outline-none" style={{ color: primaryColor }}>
                            {isLogin ? 'Register here' : 'Login here'}
                        </button>
                    </p>

                    <button onClick={() => navigate('/')} className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest flex items-center gap-2">
                        <ArrowLeft className="w-3 h-3" /> BACK TO HOME
                    </button>
                </div>
            </div>
        </div>
    );
}
