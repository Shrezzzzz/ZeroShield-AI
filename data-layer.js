const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require("socket.io");
const { analyzeLog } = require('./ai-engine');
const authRoutes = require('./routes/auth');
const Log = require('./models/Log');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up server and generic WebSockets
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

app.use(cors());
app.use(express.json());

// Boot MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/zeroshield')
  .then(() => console.log('[DB] MongoDB elegantly connected for SaaS continuity.'))
  .catch(err => console.warn('[DB] MongoDB failed to connect. Running in degraded array mode.', err.message));

// Register User Authentication Routes
app.use('/api/auth', authRoutes);

// Fallback arrays for prototype performance
const cloudLogs = [];
const denyList = [];
const isolationLogs = [];

const systemServices = [
  { name:'Auth Gateway', status:'active', icon: 'Lock' },
  { name:'API Proxy', status:'active', icon: 'ArrowRightLeft' },
  { name:'Data Pipeline', status:'active', icon: 'Database' },
  { name:'ML Engine', status:'active', icon: 'Brain' },
  { name:'Container Orch', status:'active', icon: 'Boxes' },
  { name:'Log Aggregator', status:'active', icon: 'FileText' }
];

let liveApiWindow = 0;
let liveTrafficWindow = 0;

setInterval(() => { liveApiWindow = 0; liveTrafficWindow = 0; }, 1000);

function emitDashboardStats() {
    const totalEvents = cloudLogs.length;
    const latestLog = totalEvents > 0 ? cloudLogs[totalEvents - 1] : null;
    const currentRiskScore = (latestLog && latestLog.riskScore) ? latestLog.riskScore : 0;
    const totalThreatsDetected = Math.floor(totalEvents * 0.625);
    const totalThreatsPrevented = Math.floor(totalEvents * 0.25);
    const recentAutomatedIsolations = [...isolationLogs].reverse().slice(0, 50);

    const apiCallsPerSec = liveApiWindow > 0 ? liveApiWindow : Math.floor(Math.random() * 50) + 700;
    const networkMb = liveTrafficWindow > 0 ? (liveTrafficWindow / 1024).toFixed(1) : (Math.random() * 2 + 1).toFixed(1);
    const activeUsers = Math.floor(200 + Math.random() * 30);

    io.emit('stats_update', {
        currentRiskScore, totalEvents, totalThreatsDetected, totalThreatsPrevented,
        recentAutomatedIsolations, services: systemServices,
        liveMetrics: { apiCalls: apiCallsPerSec, networkTraffic: parseFloat(networkMb), activeUsers }
    });
}

io.on('connection', (socket) => {
    emitDashboardStats();

    // Catch the Socket.io signal triggered by the frontend Dashboard Simulator Button
    socket.on('launch_sim_burst', async () => {
        io.emit('live_alert', {
            type: 'warning', msg: 'Simulated Zero-day attack burst initiated via WebSocket.',
            src: 'UI/Admin', time: new Date().toLocaleTimeString('en-US',{hour12:false})
        });

        for (let i = 0; i < 50; i++) {
            await processIngestion({
                timestamp: new Date().toISOString(),
                sourceIP: "10.13.37." + (Math.floor(Math.random() * 255)), 
                apiCall: "iam:AttachRolePolicy", 
                dataVolume: Math.floor(Math.random() * 1000) + 5000 
            });
        }
    });
});

// Centralized processing function so both external APIs or internal simulators can use it
async function processIngestion(data) {
    const { timestamp, sourceIP, apiCall, dataVolume } = data;

    if (denyList.includes(sourceIP)) return { status: 403, error: "Traffic blocked. IP is on the ZeroShield DenyList." };

    liveApiWindow += 1;
    liveTrafficWindow += dataVolume || 0;

    const newLog = { id: cloudLogs.length + 1, timestamp, sourceIP, apiCall, dataVolume, ingestedAt: new Date().toISOString() };
    const analysisResult = analyzeLog(newLog, cloudLogs);
    
    // Inject Risk Score
    const finalLog = { ...newLog, riskScore: analysisResult.riskScore, isAnomaly: analysisResult.isAnomaly, reasons: analysisResult.reasons };
    cloudLogs.push(finalLog);
    
    // Async save to mongo if connected
    try { const dbLog = new Log(finalLog); await dbLog.save(); } catch(e) {}

    io.emit('new_log', finalLog);
    emitDashboardStats();

    if (analysisResult.isAnomaly) {
        if (analysisResult.riskScore > 60) {
            io.emit('live_alert', {
                type: 'critical',
                msg: `Anomaly Detected: Volatile Access Pattern.`,
                src: sourceIP, time: new Date().toLocaleTimeString('en-US',{hour12:false})
            });
        }

        if (analysisResult.riskScore > 80) {
            if (!denyList.includes(sourceIP)) {
                denyList.push(sourceIP);
                isolationLogs.push({ ip: sourceIP, timestamp: new Date().toISOString(), reason: `Threshold Limit Reached (${analysisResult.riskScore}/100)` });
                
                const activeIdx = systemServices.findIndex(s => s.status === 'active');
                if (activeIdx > -1) systemServices[activeIdx].status = 'isolated';
                
                io.emit('live_alert', {
                    type: 'critical', msg: 'Service node automatically ISOLATED and IP blacklisted.',
                    src: sourceIP, time: new Date().toLocaleTimeString('en-US',{hour12:false})
                });
            }
        }
    }

    return { status: 201, message: "Log processed", analysis: analysisResult };
}

app.post('/api/ingest', async (req, res) => {
    const { timestamp, sourceIP, apiCall, dataVolume } = req.body;
    if (!timestamp || !sourceIP || !apiCall || dataVolume === undefined) {
        return res.status(400).json({ error: "Missing fields" });
    }
    const result = await processIngestion({ timestamp, sourceIP, apiCall, dataVolume });
    return res.status(result.status).json(result);
});

app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.get('/api/logs', (req, res) => {
    // Return logs. We format them to match the Logs.jsx UI
    const formattedLogs = cloudLogs.map(log => {
        let logType = 'system';
        if (log.isAnomaly && log.riskScore > 80) logType = 'threat';
        else if (log.apiCall.includes('auth')) logType = 'auth';
        else if (log.apiCall.includes('api') || log.apiCall.includes(':')) logType = 'api';
        
        let sev = 'info';
        if (log.riskScore > 80) sev = 'critical';
        else if (log.riskScore > 50 || log.isAnomaly) sev = 'warning';

        return {
            id: log.id,
            time: log.timestamp ? new Date(log.timestamp).toLocaleTimeString('en-US', {hour12: false}) : new Date(log.ingestedAt).toLocaleTimeString('en-US', {hour12: false}),
            type: logType,
            severity: sev,
            message: `[${log.sourceIP}] ${log.apiCall} - Vol: ${log.dataVolume} bytes. ${log.isAnomaly ? 'ANOMALY DETECTED' : 'OK'}`,
            source: log.isAnomaly ? 'AI Engine' : 'API Gateway'
        };
    });
    
    // Sort descending by id
    res.json(formattedLogs.reverse());
});

app.get('/api/stats', (req, res) => {
    // Generate dummy historical charts
    const trafficData = Array.from({ length: 24 }).map((_, i) => ({
        time: `${i}:00`,
        value: Math.floor(Math.random() * 1000) + 500,
        anomalies: Math.floor(Math.random() * 50)
    }));
    
    const apiActivityData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
        day,
        calls: Math.floor(Math.random() * 5000) + 1000,
        blocked: Math.floor(Math.random() * 500)
    }));
    
    const riskTrendData = Array.from({ length: 30 }).map((_, i) => ({
        day: i + 1,
        score: Math.floor(Math.random() * 40) + 20
    }));

    const totalEvents = cloudLogs.length;
    res.json({
        risk_score: cloudLogs.length > 0 ? cloudLogs[cloudLogs.length - 1].riskScore : 12,
        active_alerts: Math.floor(totalEvents * 0.625) || 3,
        monitored_endpoints: 1250,
        system_status: 'Online',
        traffic_data: trafficData,
        api_activity: apiActivityData,
        risk_trend: riskTrendData
    });
});

app.get('/api/threats', (req, res) => {
    // Return isolation logs or dummy active threats
    const threats = isolationLogs.map((log, i) => ({
        name: `Automated Isolation`,
        desc: log.reason,
        ip: log.ip,
        cloud: 'AWS',
        status: 'Mitigated'
    }));
    
    if (threats.length === 0) {
        threats.push(
            { name: "Brute Force Attempt", desc: "Multiple failed logins", ip: "192.168.1.100", cloud: "AWS", status: "Active" },
            { name: "SQL Injection", desc: "Malicious payload detected", ip: "10.0.0.50", cloud: "Azure", status: "Mitigated" }
        );
    }
    res.json(threats);
});

app.get('/api/simulation-results', (req, res) => {
    res.json({
        api: {
            title: "API Injection Attack",
            subtitle: "Simulated 500 malicious API requests with various injection payloads",
            score: 82,
            findings: [
                { title: "SQL Injection on /api/users", severity: "critical", mitigation: "Implement parameterized queries and input validation" },
                { title: "NoSQL Injection on /api/search", severity: "high", mitigation: "Sanitize query operators and enforce schema validation" },
                { title: "Missing rate limiting on /api/auth", severity: "medium", mitigation: "Add rate limiting middleware (100 req/min per IP)" }
            ]
        },
        ddos: {
            title: "DDoS Traffic Spike",
            subtitle: "Simulated volumetric DDoS attack on load balancer",
            score: 75,
            findings: [
                { title: "Load Balancer Saturation", severity: "critical", mitigation: "Enable automatic scaling and WAF rate limits" },
                { title: "High memory usage on API servers", severity: "high", mitigation: "Optimize endpoint response caching" }
            ]
        },
        lateral: {
            title: "Lateral Movement",
            subtitle: "Simulated internal network traversal after initial breach",
            score: 90,
            findings: [
                { title: "Unrestricted VPC Peering", severity: "critical", mitigation: "Implement strict micro-segmentation policies" },
                { title: "Plaintext credentials in memory", severity: "critical", mitigation: "Cycle all service accounts and utilize secrets manager" }
            ]
        }
    });
});

app.post('/api/simulate', async (req, res) => {
    // Return early to free request
    res.status(202).json({ message: "Zero-Day Attack burst initiated" });

    const NUM_MALICIOUS_REQUESTS = 100;
    io.emit('live_alert', {
        type: 'warning', msg: 'Simulated Zero-day attack sequence initiated by user.',
        src: 'UI/Admin', time: new Date().toLocaleTimeString('en-US',{hour12:false})
    });

    for (let i = 0; i < NUM_MALICIOUS_REQUESTS; i++) {
        await processIngestion({
            timestamp: new Date().toISOString(),
            sourceIP: "10.13.37.99", 
            apiCall: "iam:AttachRolePolicy", 
            dataVolume: Math.floor(Math.random() * 1000) + 5000 
        });
    }
});

server.listen(PORT, () => {
    console.log(`[SYS] ZeroShield Full-Stack Mode Running on port ${PORT}`);
});
