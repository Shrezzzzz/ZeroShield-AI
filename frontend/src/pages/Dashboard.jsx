import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, AlertTriangle, Server, Bell, TrendingDown } from 'lucide-react';
import { api } from '../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111827]/90 border border-white/10 p-4 rounded-xl shadow-xl shadow-black/50 backdrop-blur-md">
        <p className="text-white font-medium mb-3 text-[13px]">{label}</p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry, index) => (
            <p key={index} className="text-[13px] font-mono m-0" style={{ color: entry.color }}>
              {entry.name} : {entry.value}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, threatsData] = await Promise.all([
          api.get('/stats'),
          api.get('/threats')
        ]);
        setStats(statsData);
        setThreats(threatsData);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
        <div className="w-full h-full flex items-center justify-center bg-[#0a0f1c]">
            <div className="w-8 h-8 rounded-full border-t-2 border-[#00f0ff] animate-spin"></div>
        </div>
    );
  }

  const riskScore = stats?.risk_score || 0;
  const activeAlerts = stats?.active_alerts || 0;
  const monitoredEndpoints = stats?.monitored_endpoints || 0;
  
  const trafficData = stats?.traffic_data || [];
  const apiActivityData = stats?.api_activity || [];
  const riskTrendData = stats?.risk_trend || [];
  const activeThreatsList = Array.isArray(threats) ? threats : [];

  return (
    <div className="w-full h-full p-6 md:p-8 overflow-y-auto bg-[#0a0f1c] text-slate-200 font-outfit selection:bg-[#00f0ff]/30">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <div className="w-4 h-4 border border-slate-500 rounded-sm opacity-50"></div>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Threat Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time security monitoring across your infrastructure</p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6 flex justify-between items-center hover:border-white/[0.1] transition-colors">
          <div>
            <h3 className="text-slate-400 text-sm mb-1">Risk Score</h3>
            <div className="text-4xl font-bold text-amber-500">{riskScore}</div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6 flex justify-between items-center hover:border-white/[0.1] transition-colors">
          <div>
            <h3 className="text-slate-400 text-sm mb-1">Active Threats</h3>
            <div className="text-4xl font-bold text-rose-500">{activeAlerts}</div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
          </div>
        </div>

        <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6 flex justify-between items-center hover:border-white/[0.1] transition-colors">
          <div>
            <h3 className="text-slate-400 text-sm mb-1">Monitored Endpoints</h3>
            <div className="text-4xl font-bold text-[#00f0ff]">{monitoredEndpoints.toLocaleString()}</div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-[#00f0ff]" />
          </div>
        </div>

        <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6 flex justify-between items-center hover:border-white/[0.1] transition-colors">
          <div>
            <h3 className="text-slate-400 text-sm mb-1">System Status</h3>
            <div className="text-4xl font-bold text-emerald-500">{stats?.system_status || 'Online'}</div>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Server className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6">
          <h3 className="text-white font-bold mb-6">Traffic Patterns (24h)</h3>
          <div className="h-64">
            {trafficData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#131a2b', borderColor: '#1e293b' }} />
                    <Area type="monotone" dataKey="value" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                    <Area type="monotone" dataKey="anomalies" stroke="#ef4444" fillOpacity={1} fill="url(#colorAnomalies)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
            ) : <div className="text-slate-500 flex items-center justify-center h-full text-sm">No traffic data</div>}
          </div>
        </div>

        <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6">
          <h3 className="text-white font-bold mb-6">API Activity (7d)</h3>
          <div className="h-64">
            {apiActivityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={apiActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.08)' }} />
                    <Bar dataKey="requests" name="requests" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="errors" name="errors" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="blocked" name="blocked" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
            ) : <div className="text-slate-500 flex items-center justify-center h-full text-sm">No activity data</div>}
          </div>
        </div>
      </div>

      {/* Risk Score Trend */}
      <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6 mb-8">
        <h3 className="text-white font-bold mb-6">Risk Score Trend (30d)</h3>
        <div className="h-64">
          {riskTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={true} />
                  <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#131a2b', borderColor: '#1e293b' }} />
                  <Line type="monotone" dataKey="score" stroke="#a855f7" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
          ) : <div className="text-slate-500 flex items-center justify-center h-full text-sm">No trend data</div>}
        </div>
      </div>

      {/* Active Threats List */}
      <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6">
        <h3 className="text-white font-bold mb-6">Active Threats</h3>
        <div className="flex flex-col gap-3">
          {activeThreatsList.length === 0 ? (
              <div className="text-slate-500 text-sm py-4">No active threats detected.</div>
          ) : (
            activeThreatsList.map((threat, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-white/[0.08] bg-[#0c1322] hover:bg-white/[0.05] transition-colors gap-4">
                <div className="flex items-center gap-5">
                    <div className="flex items-center justify-center">
                        <AlertTriangle className={threat.status === 'Active' ? 'text-rose-500 w-5 h-5' : threat.status === 'Investigating' ? 'text-amber-500 w-5 h-5' : 'text-[#00f0ff] w-5 h-5'} />
                    </div>
                    <div>
                    <div className="text-slate-200 font-medium text-[15px]">{threat.name || threat.title}</div>
                    <div className="text-slate-500 text-sm mt-0.5">{threat.desc || threat.explanation} · {threat.ip}</div>
                    </div>
                </div>
                <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className={`text-[13px] font-bold tracking-wider ${threat.cloud === 'AWS' ? 'text-amber-500' : threat.cloud === 'Azure' ? 'text-[#00f0ff]' : 'text-emerald-400'}`}>
                    {threat.cloud}
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[13px] font-bold ${
                    threat.status === 'Active' ? 'bg-rose-500 text-white' : 
                    threat.status === 'Investigating' ? 'bg-white/10 text-white' : 
                    'bg-[#00f0ff] text-[#050914]'
                    }`}>
                    {threat.status}
                    </div>
                </div>
                </div>
            ))
          )}
        </div>
      </div>
      
    </div>
  );
}
