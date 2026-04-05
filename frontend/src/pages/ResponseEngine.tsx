import { useState } from 'react';
import { ShieldAlert, ShieldCheck, Ban, Server, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

type ServiceStatus = 'At Risk' | 'Protected' | 'Isolated';

interface Service {
  id: string;
  name: string;
  cloud: string;
  status: ServiceStatus;
}

const initialServices: Service[] = [
  { id: 'api', name: 'API Gateway', cloud: 'AWS', status: 'At Risk' },
  { id: 'auth', name: 'Auth Service', cloud: 'AWS', status: 'At Risk' },
  { id: 'payment', name: 'Payment Processor', cloud: 'Azure', status: 'Protected' },
  { id: 'userdb', name: 'User Database', cloud: 'GCP', status: 'Protected' },
  { id: 'analytics', name: 'Analytics Pipeline', cloud: 'Azure', status: 'At Risk' },
  { id: 'cdn', name: 'CDN Edge Nodes', cloud: 'AWS', status: 'Protected' },
];

export default function ResponseEngine() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [blockedIps, setBlockedIps] = useState(['192.168.1.45', '10.0.0.112', '172.16.0.89']);
  const { addNotification } = useNotifications();

  const isolateService = (id: string) => {
    const serviceName = services.find(s => s.id === id)?.name;
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: 'Isolated' } : s));
    addNotification({
        title: 'Service Isolated',
        message: `${serviceName || id} has been successfully isolated.`,
        severity: 'warning',
        type: 'system'
    });
  };

  const blockRandomIp = () => {
    const randomIp = `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
    setBlockedIps(prev => [...prev, randomIp]);
    addNotification({
        title: 'Suspicious IP Blocked',
        message: `Globally blocked inbound traffic from ${randomIp}.`,
        severity: 'critical',
        type: 'threat'
    });
  };

  return (
    <div className="w-full h-full p-6 md:p-8 overflow-y-auto bg-[#0a0f1c] text-slate-200 font-outfit selection:bg-[#00f0ff]/30">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Response Engine</h1>
          <p className="text-slate-400 text-sm">Auto-response and service protection controls</p>
        </div>

        <button 
          onClick={blockRandomIp}
          className="flex items-center gap-2 text-sm font-bold tracking-wide px-4 py-2 rounded-lg transition-all border border-rose-500/50 text-rose-500 hover:bg-rose-500/10"
        >
          <Ban className="w-4 h-4" />
          Block Suspicious IP
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {services.map(service => {
          const isAtRisk = service.status === 'At Risk';
          const isProtected = service.status === 'Protected';
          const isIsolated = service.status === 'Isolated';

          return (
            <div key={service.id} className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6 flex flex-col justify-between min-h-[160px]">
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {isAtRisk && <ShieldAlert className="w-5 h-5 text-rose-500" />}
                    {isProtected && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                    {isIsolated && <Ban className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{service.name}</h3>
                    <p className="text-slate-500 text-xs">{service.cloud}</p>
                  </div>
                </div>

                <div className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                  isAtRisk ? 'bg-rose-500/20 text-rose-500' : 
                  isProtected ? 'bg-emerald-500/10 text-emerald-500' : 
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  {service.status}
                </div>
              </div>

              <div className="mt-auto">
                {isAtRisk && (
                  <button 
                    onClick={() => isolateService(service.id)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-amber-500/30 text-amber-500 text-sm font-medium hover:bg-amber-500/10 transition-colors"
                  >
                    <Server className="w-4 h-4" />
                    Isolate Service
                  </button>
                )}

                {isIsolated && (
                  <div className="flex items-center gap-2 text-amber-500 text-xs font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Service isolated — monitoring
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Blocked IPs Section */}
      <div className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6">
        <h3 className="text-white font-bold mb-6">Blocked IPs</h3>
        <div className="flex flex-wrap gap-3">
          {blockedIps.map(ip => (
            <div key={ip} className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-3 py-1.5 rounded-lg text-sm font-mono font-medium flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {ip}
            </div>
          ))}
          {blockedIps.length === 0 && (
            <p className="text-slate-500 text-sm italic">No IPs currently blocked globally.</p>
          )}
        </div>
      </div>

    </div>
  );
}
