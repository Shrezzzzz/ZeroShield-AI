/**
 * Analyzes a new log against historical logs to detect anomalies.
 * @param {Object} newLog - The incoming log to analyze.
 * @param {Array} existingLogs - The array of historical logs representing the baseline.
 * @returns {Object} { isAnomaly: boolean, riskScore: number, reasons: string[] }
 */
function analyzeLog(newLog, existingLogs) {
    let riskScore = 0;
    const reasons = [];

    // Filter to previous logs (excluding the exact same log if it happened to be in the array)
    const historicalLogs = existingLogs.filter(log => log.id !== newLog.id);

    if (historicalLogs.length > 0) {
        // 1. Check for dataVolume anomaly
        const totalVolume = historicalLogs.reduce((sum, log) => sum + log.dataVolume, 0);
        const averageVolume = totalVolume / historicalLogs.length;

        // Anomaly: Volume is 3x higher than average
        if (averageVolume > 0 && newLog.dataVolume > averageVolume * 3) {
            riskScore += 60; // High severity for unusual data exfiltration/volume
            reasons.push(`Data volume (${newLog.dataVolume}) is more than 3x the baseline average (${averageVolume.toFixed(2)})`);
        } else if (averageVolume === 0 && newLog.dataVolume > 0) {
            // Edge case: baseline was all zeros, but now we have data
            riskScore += 30;
            reasons.push(`Spike from 0 average volume to ${newLog.dataVolume}`);
        }

        // 2. Check for unrecognized sourceIP anomaly
        const knownIPs = new Set(historicalLogs.map(log => log.sourceIP));
        if (!knownIPs.has(newLog.sourceIP)) {
            riskScore += 40; // Medium-high severity for unrecognized IP
            reasons.push(`Unrecognized source IP address: ${newLog.sourceIP}`);
        }
    } else {
        // First log in the system establishes the baseline. 
        // No baseline exists to compare against.
        reasons.push("Initial baseline established.");
    }

    // Ensure riskScore is capped at 100
    riskScore = Math.min(riskScore, 100);

    return {
        isAnomaly: riskScore > 0,
        riskScore,
        reasons
    };
}

module.exports = {
    analyzeLog
};
