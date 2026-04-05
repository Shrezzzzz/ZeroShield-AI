const http = require('http');

/**
 * Utility to send HTTP POST request to the local Data Layer
 */
function sendPostRequest(endpoint, data) {
    return new Promise((resolve, reject) => {
        const jsonData = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(jsonData)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk.toString());
            res.on('end', () => resolve(JSON.parse(body)));
        });

        req.on('error', (e) => reject(e));
        req.write(jsonData);
        req.end();
    });
}

// Hardcoded IP addresses for baseline normal activity
const NORMAL_IPS = ["192.168.1.10", "192.168.1.50"];

/**
 * Simulates a standard user or service making an expected API call
 */
async function simulateNormalTraffic() {
    const data = {
        timestamp: new Date().toISOString(),
        sourceIP: NORMAL_IPS[Math.floor(Math.random() * NORMAL_IPS.length)],
        apiCall: "s3:GetObject",
        dataVolume: Math.floor(Math.random() * 50) + 10 // Normal volume (10-60 units)
    };
    
    try {
        const response = await sendPostRequest('/api/ingest', data);
        if (response.analysis) {
            console.log(`[Simulator] Normal Traffic Sent. API: ${data.apiCall} | Score: ${response.analysis.riskScore}`);
        } else {
            console.log(`[Simulator] Initial Baseline Traffic Sent. API: ${data.apiCall}`);
        }
    } catch (e) {
        console.error("[Simulator] Failed to communicate with Data Layer. Is data-layer.js running?");
    }
}

/**
 * Simulates an unknown attacker probing the system and exfiltrating data en masse
 */
async function simulateAttackBurst() {
    console.log("\n=======================================================");
    console.log("⚠️  LAUNCHING SIMULATED ZERO-DAY ATTACK BURST!");
    console.log("=======================================================\n");

    const promises = [];
    const NUM_MALICIOUS_REQUESTS = 100;

    for (let i = 0; i < NUM_MALICIOUS_REQUESTS; i++) {
        const data = {
            timestamp: new Date().toISOString(),
            sourceIP: "10.13.37.99", // Completely unrecognized IP
            apiCall: "iam:AttachRolePolicy", // High-privilege API call
            dataVolume: Math.floor(Math.random() * 1000) + 5000 // Huge volume exfiltration (5000-6000 units)
        };
        
        promises.push(sendPostRequest('/api/ingest', data)
            .then(response => {
                if (response.analysis && response.analysis.isAnomaly) {
                    return response.analysis.riskScore;
                }
                return 0;
            })
            .catch(() => 0)
        );
    }
    
    const results = await Promise.all(promises);
    const minScore = Math.min(...results);
    const maxScore = Math.max(...results);
    
    console.log(`\n[Simulator] Attack burst complete (${NUM_MALICIOUS_REQUESTS} requests fired).`);
    console.log(`[Simulator] AI Detection Engine Risk Scores ranged from ${minScore} to ${maxScore} out of 100.\n`);
}

/**
 * Main execution loop bridging the background processes
 */
async function runSimulation() {
    console.log("Starting ZeroShield Attack Simulation Engine...");
    console.log("Waiting briefly to ensure data-layer is ready...\n");
    
    await new Promise(r => setTimeout(r, 2000));

    // 1. Establish the behavioral baseline rapidly
    console.log("Phase 1: Establishing behavioral baseline with normal traffic...");
    for (let i = 0; i < 5; i++) {
        await simulateNormalTraffic();
        await new Promise(r => setTimeout(r, 400));
    }

    console.log("\nPhase 2: Transitioning to Continuous Monitoring Mode.");
    
    // 2. Continuous hum of normal traffic every 2 seconds
    setInterval(simulateNormalTraffic, 2000);

    // 3. Suddenly drop a massive attack burst every 15 seconds
    setInterval(simulateAttackBurst, 15000);
}

runSimulation();
