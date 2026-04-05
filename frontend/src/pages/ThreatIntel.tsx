import { Globe } from 'lucide-react';

const mockThreatFeed = [
  {
    id: 1,
    title: 'New Zero-Day in Apache Struts',
    severity: 'critical',
    cve: 'CVE-2024-23108',
    description: 'Critical RCE vulnerability allowing remote code execution without authentication',
    source: 'MITRE ATT&CK',
    date: '2024-03-15'
  },
  {
    id: 2,
    title: 'Supply Chain Attack via npm Package',
    severity: 'high',
    cve: 'CVE-2024-22156',
    description: 'Malicious code found in popular npm package with 2M+ weekly downloads',
    source: 'GitHub Advisory',
    date: '2024-03-14'
  },
  {
    id: 3,
    title: 'Kubernetes API Server Vulnerability',
    severity: 'high',
    cve: 'CVE-2024-21903',
    description: 'Authentication bypass in Kubernetes API server allows unauthorized access',
    source: 'NVD',
    date: '2024-03-13'
  },
  {
    id: 4,
    title: 'Cloud Storage Misconfiguration Wave',
    severity: 'medium',
    description: 'Increase in attacks targeting misconfigured S3 buckets and Azure Blob storage',
    source: 'CrowdStrike',
    date: '2024-03-12'
  }
];

export default function ThreatIntel() {
  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-rose-500/20 text-rose-500';
      case 'high': return 'bg-amber-500/20 text-amber-500';
      case 'medium': return 'bg-sky-500/20 text-sky-500';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="w-full h-full p-6 md:p-8 overflow-y-auto bg-[#0a0f1c] text-slate-200 font-outfit selection:bg-[#00f0ff]/30">
      
      {/* Top Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Threat Intelligence Feed</h1>
        <p className="text-slate-400 text-sm">Global threat intelligence from leading security sources</p>
      </div>

      {/* Feed List */}
      <div className="flex flex-col gap-4">
        {mockThreatFeed.map(feed => (
          <div key={feed.id} className="bg-[#131a2b] border border-white/[0.05] rounded-xl p-6 flex flex-col md:flex-row gap-6 transition-all hover:border-white/[0.1] hover:bg-[#161e32]">
            
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Globe className="w-6 h-6 text-[#00f0ff]" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-white">{feed.title}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getSeverityStyle(feed.severity)}`}>
                  {feed.severity}
                </span>
                {feed.cve && (
                  <span className="px-3 py-0.5 rounded-full border border-white/[0.1] text-slate-300 text-[11px] font-mono tracking-wider font-semibold">
                    {feed.cve}
                  </span>
                )}
              </div>

              <p className="text-slate-400 text-sm mb-4 leading-relaxed max-w-4xl">
                {feed.description}
              </p>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span>Source: {feed.source}</span>
                <span>·</span>
                <span className="font-mono">{feed.date}</span>
              </div>
              
            </div>
            
          </div>
        ))}
      </div>

    </div>
  );
}
