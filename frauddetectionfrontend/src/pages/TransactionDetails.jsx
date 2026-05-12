import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert, CheckCircle, ArrowLeft, Clock, MapPin,
  Monitor, CreditCard, ShieldBan, Eye, Wifi, Globe,
  Hash, Building2, Tag, Layers
} from "lucide-react";

import { getTransactionDetails, updateTransactionAction } from "../services/transactionService";
import RiskBadge from "../components/common/RiskBadge";

// ── Reusable field component ──────────────────────────────────────────────────
function Field({ label, value, mono = false, icon: Icon }) {
  return (
    <div>
      <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
        {Icon && <Icon size={11} />} {label}
      </p>
      <p className={`text-sm text-gray-200 break-all ${mono ? "font-mono" : ""}`}>
        {value ?? <span className="text-gray-600 italic">—</span>}
      </p>
    </div>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-[#1e293b]/40 rounded-xl border border-white/5 p-5">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Icon size={14} className="text-brand-primary" /> {title}
      </h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getTransactionDetails(id);
        setTransaction(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleAction = async (actionType) => {
    if (!window.confirm(`Change this transaction to ${actionType}?`)) return;
    try {
      setProcessingAction(actionType);
      await updateTransactionAction(id, actionType);
      let newFraud = transaction.fraud;
      let newRiskLevel = transaction.riskLevel;
      if (actionType === "ALLOW") { newFraud = false; newRiskLevel = "LOW"; }
      else if (actionType === "REVIEW") { newFraud = false; newRiskLevel = "MEDIUM"; }
      else if (actionType === "BLOCK") { newFraud = true; newRiskLevel = "HIGH"; }
      setTransaction(prev => ({
        ...prev, action: actionType, fraud: newFraud, riskLevel: newRiskLevel,
        reason: `Manually overridden to ${actionType} by admin`
      }));
    } catch (error) {
      console.error(error);
      alert("Failed to update transaction.");
    } finally {
      setProcessingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!transaction) {
    return <div className="text-gray-400 text-center mt-10">Transaction not found.</div>;
  }

  const isBlocked = transaction.action === "BLOCK" || transaction.action === "BLOCK_AND_ALERT";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* ── Top Bar ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="flex gap-2">
          {transaction.action !== "ALLOW" && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleAction("ALLOW")} disabled={processingAction !== null}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/30 rounded-xl text-sm font-bold hover:bg-green-500/20 transition-all disabled:opacity-50"
            >
              <CheckCircle size={16} />
              {processingAction === "ALLOW" ? "Processing…" : "Approve"}
            </motion.button>
          )}
          {transaction.action !== "REVIEW" && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleAction("REVIEW")} disabled={processingAction !== null}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-xl text-sm font-bold hover:bg-amber-500/20 transition-all disabled:opacity-50"
            >
              <Eye size={16} />
              {processingAction === "REVIEW" ? "Processing…" : "Flag Review"}
            </motion.button>
          )}
          {transaction.action !== "BLOCK" && (
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => handleAction("BLOCK")} disabled={processingAction !== null}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-accent/10 text-brand-accent border border-brand-accent/30 rounded-xl text-sm font-bold hover:bg-brand-accent/20 transition-all disabled:opacity-50"
            >
              <ShieldBan size={16} />
              {processingAction === "BLOCK" ? "Processing…" : "Block Fraud"}
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Hero Card ─────────────────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl border border-white/5 p-8 relative overflow-hidden">
        <div className={`absolute -right-20 -top-20 w-72 h-72 rounded-full blur-[100px] opacity-15 pointer-events-none ${isBlocked ? "bg-brand-accent" : "bg-brand-primary"}`} />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white font-mono">{transaction.transactionId}</h1>
              {transaction.fraud ? (
                <span className="px-3 py-1 bg-brand-accent/20 text-brand-accent text-xs font-bold rounded-lg border border-brand-accent/30 flex items-center gap-1.5">
                  <ShieldAlert size={13} /> FRAUD
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg border border-green-500/30 flex items-center gap-1.5">
                  <CheckCircle size={13} /> SAFE
                </span>
              )}
              <RiskBadge level={transaction.riskLevel} />
            </div>
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <Clock size={13} /> {new Date(transaction.timestamp).toLocaleString()}
            </p>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transaction Amount</p>
            <p className="text-4xl font-bold text-white">
              {transaction.currency || "$"}{" "}
              {transaction.amount != null
                ? Number(transaction.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })
                : "—"}
            </p>
            {transaction.transactionType && (
              <span className="text-xs text-gray-500 mt-1 inline-block capitalize">{transaction.transactionType} · {transaction.channel}</span>
            )}
          </div>
        </div>

        {/* ── Detail Sections Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Section 1: Account & Customer */}
          <Section title="Account & Customer" icon={CreditCard}>
            <Field label="Customer ID" value={transaction.customerId} mono />
            <Field label="Account ID" value={transaction.accountId} mono />
            <Field label="Customer Country" value={transaction.customerCountry} icon={Globe} />
            <Field label="Transaction Type" value={transaction.transactionType} icon={Tag} />
          </Section>

          {/* Section 2: Merchant */}
          <Section title="Merchant" icon={Building2}>
            <Field label="Merchant ID" value={transaction.merchantId} mono />
            <Field label="Category" value={transaction.merchantCategory} icon={Layers} />
            <Field label="Country" value={transaction.merchantCountry} icon={MapPin} />
            <Field label="Channel" value={transaction.channel} />
          </Section>

          {/* Section 3: Device & Network */}
          <Section title="Device & Network" icon={Monitor}>
            <Field label="Device ID" value={transaction.deviceId} mono icon={Monitor} />
            <Field label="IP Address" value={transaction.ipAddress} mono icon={Wifi} />
          </Section>

          {/* Section 4: Risk Assessment */}
          <Section title="Risk Assessment" icon={ShieldAlert}>
            <div className="col-span-2 grid grid-cols-3 gap-4 mb-2">
              <div className="bg-[#0b0f19]/60 rounded-xl p-3 text-center border border-white/5">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Score</p>
                <p className={`text-2xl font-bold ${transaction.riskScore > 75 ? "text-brand-accent" : transaction.riskScore > 40 ? "text-amber-400" : "text-green-400"}`}>
                  {transaction.riskScore ?? "—"}
                </p>
              </div>
              <div className="bg-[#0b0f19]/60 rounded-xl p-3 text-center border border-white/5">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Level</p>
                <RiskBadge level={transaction.riskLevel} />
              </div>
              <div className="bg-[#0b0f19]/60 rounded-xl p-3 text-center border border-white/5">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Action</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                  isBlocked ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20"
                  : transaction.action === "REVIEW" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  : transaction.action === "CHALLENGE_MFA" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                  : "bg-green-500/10 text-green-400 border-green-500/20"
                }`}>
                  {transaction.action}
                </span>
              </div>
            </div>

            {/* Detection reason — full width */}
            <div className="col-span-2">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Hash size={11} /> Detection Reason
              </p>
              <div className="bg-[#0b0f19]/60 border border-white/5 rounded-xl p-3">
                <p className="text-sm text-gray-300 italic leading-relaxed">{transaction.reason ?? "—"}</p>
              </div>
            </div>

            {/* XAI: Risk Composition Chart */}
            {transaction.riskAnalysis && (
              <div className="col-span-2 mt-4">
                <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <Activity size={11} /> AI Explainability: Risk Composition
                </p>
                <div className="space-y-3 bg-[#0b0f19]/40 p-4 rounded-xl border border-white/5">
                  {transaction.riskAnalysis.split(';').map((item, idx) => {
                    const [key, val] = item.split(':');
                    const score = parseInt(val);
                    if (score <= 0 && key !== 'Baseline') return null;
                    
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400">
                          <span>{key}</span>
                          <span className="font-bold text-gray-300">{val} pts</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (score / 100) * 100)}%` }}
                            transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                            className={`h-full rounded-full ${
                              score > 40 ? 'bg-brand-accent' : score > 20 ? 'bg-amber-400' : 'bg-brand-primary'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Section>
        </div>
      </div>
    </motion.div>
  );
}

export default TransactionDetails;