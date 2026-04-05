import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, Clock, Info } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../services/api';

export default function Threats() {
  const [threats, setThreats] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  const fetchDetections = async () => {
    try {
      const data = await api.get('/detections');
      setThreats(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load detections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetections();
  }, []);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    try {
      await api.post('/analyze');
      addNotification({
          title: 'AI Analysis Complete',
          message: 'Analysis scan finished investigating cluster activity.',
          severity: 'info',
          type: 'system'
      });
      fetchDetections(); // Refresh list after analysis
    } catch (err) {
      addNotification({
          title: 'Analysis Failed',
          message: err.message || 'Failed to connect to the analysis engine.',
          severity: 'warning',
          type: 'system'
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full h-full p-6 md:p-8 overflow-y-auto bg-[#0a0f1c] text-slate-200 font-outfit selection:bg-[#00f0ff]/30">
      
      {/* Top Bar */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">AI Threat Detection</h1>
          <p className="text-slate-400 text-sm">Behavioral analysis powered by machine learning</p>
        </div>

        <button 
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className={`flex items-center gap-2 text-sm font-bold tracking-wide px-5 py-2.5 rounded-lg transition-all ${
            analyzing 
              ? 'bg-[#00f0ff]/50 text-slate-900 cursor-not-allowed' 
              : 'bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-[#050914]'
          }`}
        >
          <Brain className={`w-4 h-4 ${analyzing ? 'animate-pulse' : ''}`} />
          {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-10">
          <div className="w-8 h-8 rounded-full border-t-2 border-[#00f0ff] animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {threats.length === 0 ? (
            <div className="text-slate-500 py-6 text-center">No structural threats detected on the active nodes.</div>
          ) : (
            threats.map((threat) => {
              const isCritical = threat.type === 'critical' || threat.severity === 'critical';
              
              return (
                <div key={threat.id} className={`flex items-start gap-4 p-5 rounded-xl border ${
                  isCritical 
                    ? 'bg-[#1a0f14] border-rose-900/50' 
                    : 'bg-[#14120b] border-amber-900/50'
                }`}>
                  
                  {/* Icon Container */}
                  <div className={`mt-1 flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${
                    isCritical ? 'bg-rose-500/10' : 'bg-transparent'
                  }`}>
                    {isCritical 
                      ? <AlertTriangle className="w-5 h-5 text-rose-500" />
                      : <Clock className="w-5 h-5 text-amber-500" />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-3">
                    
                    {/* Meta Row */}
                    <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                      <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isCritical ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        {threat.status}
                      </div>
                      <span>{threat.time || threat.timestamp}</span>
                      <span>·</span>
                      <span>Confidence: {threat.confidence}</span>
                      <span>·</span>
                      <span>Deviation: {threat.deviation}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base text-slate-200 font-medium">{threat.title}</h3>

                    {/* Explanation Box */}
                    <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
                      isCritical ? 'bg-rose-950/20 text-slate-400' : 'bg-[#1a1814] text-slate-400'
                    }`}>
                      <Info className="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
                      <p>{threat.explanation}</p>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
