import React, { useMemo } from 'react';

/**
 * Maintenance Recommendation Engine Component
 * Displays maintenance recommendations based on risk score - Light Theme
 */

const MaintenanceRecommendation = ({ riskScore }) => {
  // Generate recommendation details using useMemo for performance
  const details = useMemo(() => {
    if (riskScore < 40) {
      return {
        recommendation: "Routine Monitoring Recommended",
        priority: "LOW",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        badgeColor: "bg-emerald-500 text-white",
        icon: "✅",
        actionItems: [
          "Continue regular monitoring schedule",
          "Review data logs weekly",
          "No immediate action required",
          "Maintain standard maintenance protocols",
        ],
        timeline: "Next scheduled inspection: 30 days",
        description: "Bridge is operating within normal parameters. Continue with standard maintenance protocols.",
        progressGradient: "from-emerald-400 to-teal-400"
      };
    }
    if (riskScore >= 40 && riskScore < 75) {
      return {
        recommendation: "Schedule Structural Inspection Within 7 Days",
        priority: "MEDIUM",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        badgeColor: "bg-amber-500 text-white",
        icon: "⚠️",
        actionItems: [
          "Schedule inspection within 7 days",
          "Increase monitoring frequency to daily",
          "Document sensor anomalies",
          "Alert maintenance team immediately",
        ],
        timeline: "Action required within: 7 days",
        description: "Structural integrity showing elevated stress levels. Professional inspection recommended to ensure continued safety.",
        progressGradient: "from-amber-400 to-orange-400"
      };
    }
    return {
      recommendation: "Immediate Load Restriction & Emergency Inspection Required",
      priority: "CRITICAL",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-300",
      textColor: "text-rose-700",
      badgeColor: "bg-rose-600 text-white",
      icon: "🚨",
      actionItems: [
        "🔴 IMMEDIATE: Restrict vehicle loads",
        "🚦 Implement emergency traffic control",
        "🔧 Emergency structural inspection required",
        "📢 Notify authorities immediately",
        "🚫 Divert traffic if necessary",
      ],
      timeline: "Action required: IMMEDIATE (within 24 hours)",
      description: "CRITICAL: Bridge detected with severe structural stress. Immediate action and emergency inspection required.",
      progressGradient: "from-rose-500 to-pink-500"
    };
  }, [riskScore]);

  return (
    <div className={`card-professional p-6 border-2 ${details.borderColor} ${details.bgColor}`}>
      {/* Header with Icon and Priority Badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{details.icon}</span>
          <h3 className="text-lg font-bold text-text-primary">Maintenance Recommendation</h3>
        </div>
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${details.badgeColor} shadow-sm`}>
          {details.priority}
        </span>
      </div>

      {/* Main Recommendation Text */}
      <div className={`mb-5 p-4 rounded-xl bg-white border-2 ${details.borderColor} border-opacity-50`}>
        <p className={`text-lg font-bold ${details.textColor} mb-2`}>
          {details.recommendation}
        </p>
        <p className="text-text-secondary leading-relaxed text-sm">
          {details.description}
        </p>
      </div>

      {/* Timeline */}
      <div className="mb-5 flex items-center gap-3 text-sm font-semibold text-primary-600 bg-primary-50 px-4 py-3 rounded-xl">
        <span className="text-xl">⏱️</span>
        <span>{details.timeline}</span>
      </div>

      {/* Action Items */}
      <div className="mb-5">
        <h4 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
          <span>✓</span>
          <span>Required Actions:</span>
        </h4>
        <ul className="space-y-2">
          {details.actionItems.map((item, index) => (
            <li
              key={index}
              className="text-sm flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-100"
            >
              <span className="text-lg mt-0.5">→</span>
              <span className="font-medium text-text-secondary">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Score Meter */}
      <div className="p-5 rounded-xl bg-white border-2 border-slate-200 mb-5">
        <p className="text-sm text-text-muted mb-3 font-medium text-center">Current Risk Score</p>
        <div className="flex items-center justify-center gap-3">
          <p className={`text-5xl font-extrabold ${details.textColor}`}>
            {riskScore.toFixed(0)}
          </p>
          <p className="text-lg text-text-muted font-medium">/ 100</p>
        </div>
        <div className="mt-4 w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${details.progressGradient.startsWith('from-') ? `bg-gradient-to-r ${details.progressGradient}` : 'bg-gradient-to-r from-emerald-400 to-teal-400'}`}
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      {/* Footer Note */}
      <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
        <p className="text-xs text-text-secondary leading-relaxed">
          <span className="text-primary-600 font-bold">📋 Disclaimer:</span>
          <br />
          This recommendation is based on real-time sensor data analysis. Always conduct professional inspections
          and consult with qualified structural engineers for critical decisions.
        </p>
      </div>
    </div>
  );
};

export default MaintenanceRecommendation;
