import { useState } from 'react';
import { Zap, Target, Shield, Play, Loader2, AlertTriangle, ShieldAlert, Info, InfoIcon } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';

export default function AttackSimulation() {
  const [runningSim, setRunningSim] = useState<string | null>(null);
  const [activeResult, setActiveResult] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string, show: boolean }>({ message: '', show: false });
  const { addNotification } = useNotifications();

  const runSimulation = async (type: string) => {
    setRunningSim(type);
    setActiveResult(null);
    setToast({ message: 'Simulation started...', show: true });

    try {
      await api.post('/simulate', { type });
      const results: any = await api.get('/simulation-results');

      // Handle potential API response structures (array history or object map)
      let resultData = null;
      if (Array.isArray(results)) {
        resultData = results.find((r: any) => r.type === type) || results[0];
      } else if (results && results[type]) {
        resultData = results[type];
      } else {
        resultData = results;
      }

      setActiveResult(resultData);
      setToast({ message: 'Simulation complete — vulnerabilities found!', show: true });

      if (resultData) {
        addNotification({
          title: 'Simulation Complete',
          message: `${resultData.title || 'Simulation'} finished measuring a severity score of ${resultData.score || 0}/100.`,
          severity: (resultData.score || 0) > 80 ? 'critical' : 'warning',
          type: 'simulation'
        });
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Simulation execution failed.', show: true });
    } finally {
      setRunningSim(null);
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    }
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-rose-500/20 text-rose-500';
      case 'high': return 'bg-amber-500/20 text-amber-500';
      case 'medium': return 'bg-sky-500/20 text-sky-500';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="w-full h-full p-6 md:p-8 overflow-y-auto bg-[#0a0f1c] text-slate-200 font-outfit selection:bg-[#00f0ff]/30 relative">

      {/* Top Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Attack Simulation Engine</h1>
        <p className="text-slate-400 text-sm">Run controlled simulations to discover vulnerabilities</p>
      </div>

      {/* Simulation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Card 1 */}
        <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6 flex flex-col">
          <Zap className="w-6 h-6 text-[#00f0ff] mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">API Injection Attack</h3>
          <p className="text-sm text-slate-500 flex-1 mb-6">Simulates SQL/NoSQL injection via API endpoints</p>
          <button
            onClick={() => runSimulation('api')}
            disabled={runningSim !== null}
            className={`w-full py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${runningSim === 'api'
              ? 'bg-transparent border-white/[0.05] text-slate-500 cursor-not-allowed'
              : 'bg-transparent border-white/[0.1] text-slate-300 hover:bg-white/[0.02] hover:border-white/[0.2]'
              }`}
          >
            {runningSim === 'api' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {runningSim === 'api' ? 'Running...' : 'Run Simulation'}
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6 flex flex-col">
          <Target className="w-6 h-6 text-[#00f0ff] mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">DDoS Traffic Spike</h3>
          <p className="text-sm text-slate-500 flex-1 mb-6">Simulates volumetric DDoS attack on load balancer</p>
          <button
            onClick={() => runSimulation('ddos')}
            disabled={runningSim !== null}
            className={`w-full py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${runningSim === 'ddos'
              ? 'bg-transparent border-white/[0.05] text-slate-500 cursor-not-allowed'
              : 'bg-transparent border-white/[0.1] text-slate-300 hover:bg-white/[0.02] hover:border-white/[0.2]'
              }`}
          >
            {runningSim === 'ddos' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {runningSim === 'ddos' ? 'Running...' : 'Run Simulation'}
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6 flex flex-col">
          <Shield className="w-6 h-6 text-[#00f0ff] mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">Lateral Movement</h3>
          <p className="text-sm text-slate-500 flex-1 mb-6">Simulates internal network traversal after initial breach</p>
          <button
            onClick={() => runSimulation('lateral')}
            disabled={runningSim !== null}
            className={`w-full py-2.5 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${runningSim === 'lateral'
              ? 'bg-transparent border-white/[0.05] text-slate-500 cursor-not-allowed'
              : 'bg-transparent border-white/[0.1] text-slate-300 hover:bg-white/[0.02] hover:border-white/[0.2]'
              }`}
          >
            {runningSim === 'lateral' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {runningSim === 'lateral' ? 'Running...' : 'Run Simulation'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {activeResult && (
        <div className="bg-transparent border border-white/[0.05] rounded-xl p-8 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-xl font-bold flex items-center gap-2 text-white mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Simulation Results: {activeResult.title || 'Unknown Attack'}
          </h2>
          <p className="text-slate-500 text-sm mb-6">{activeResult.subtitle || 'Vulnerability scan complete.'}</p>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-slate-400 font-medium">Vulnerability Score:</span>
            <span className={`text-2xl font-bold ${activeResult.score > 80 ? 'text-rose-500' : 'text-amber-500'}`}>{activeResult.score || 0}/100</span>
          </div>

          <div className="flex flex-col gap-4">
            {(activeResult.findings || []).map((finding: any, i: number) => (
              <div key={i} className="bg-[#111522] border border-white/[0.03] rounded-lg p-5">
                <div className="flex items-center gap-3 mb-2">
                  {finding.severity?.toLowerCase() === 'critical' ? (
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                  ) : finding.severity?.toLowerCase() === 'high' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <InfoIcon className="w-4 h-4 text-sky-500 shrink-0" />
                  )}
                  <span className="text-slate-200 font-medium text-sm">{finding.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getSeverityStyle(finding.severity)}`}>
                    {finding.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-500 ml-7">Mitigation: {finding.mitigation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div className={`fixed bottom-8 right-8 bg-[#1a1c23] border border-white/[0.1] shadow-2xl rounded-lg px-4 py-3 flex items-center gap-3 transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}>
        <Info className="w-4 h-4 text-slate-300" />
        <span className="text-sm text-slate-200 font-medium">{toast.message}</span>
      </div>

    </div>
  );
}
