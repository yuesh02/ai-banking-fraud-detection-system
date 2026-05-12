import { useState } from "react";
import { motion } from "framer-motion";
import { Beaker, Send, RefreshCcw, ShieldAlert, CheckCircle, Info, Activity } from "lucide-react";
import apiClient from "../api/apiClient";

function SimulatorLab() {
  const [formData, setFormData] = useState({
    customerId: "Rahul Sharma",
    accountId: "ACC-5592",
    amount: 5000.00,
    currency: "USD",
    transactionType: "DEBIT",
    merchantId: "Binance Exchange",
    merchantCategory: "CRYPTO",
    merchantCountry: "RU",
    customerCountry: "IN",
    deviceId: "iPhone-Manual-Lab",
    ipAddress: "45.23.1.5",
    channel: "MOBILE_APP"
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiClient.post("/transactions", {
        ...formData,
        transactionId: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      });
      setResult(res.data);
    } catch (error) {
      console.error("Injection failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
      customerId: "Sarah Jenkins",
      accountId: "ACC-1024",
      amount: 120.00,
      currency: "USD",
      transactionType: "DEBIT",
      merchantId: "Amazon.com",
      merchantCategory: "E-COMMERCE",
      merchantCountry: "US",
      customerCountry: "US",
      deviceId: "MacBook-Lab",
      ipAddress: "192.168.1.50",
      channel: "WEB"
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Outfit'] mb-1">Simulator Lab</h1>
          <p className="text-gray-400 text-sm text-left">Manually craft and inject transactions to test detection rules.</p>
        </div>
        <button 
          onClick={handleReset}
          className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 glass-card p-6 border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input label="Customer Name" value={formData.customerId} onChange={(v) => setFormData({...formData, customerId: v})} />
              <Input label="Account ID" value={formData.accountId} onChange={(v) => setFormData({...formData, accountId: v})} />
              <Input label="Amount" type="number" value={formData.amount} onChange={(v) => setFormData({...formData, amount: parseFloat(v)})} />
              <Input label="Currency" value={formData.currency} onChange={(v) => setFormData({...formData, currency: v})} />
              <Input label="Type" value={formData.transactionType} onChange={(v) => setFormData({...formData, transactionType: v})} />
              <Input label="Merchant Name" value={formData.merchantId} onChange={(v) => setFormData({...formData, merchantId: v})} />
              <Input label="Category" value={formData.merchantCategory} onChange={(v) => setFormData({...formData, merchantCategory: v})} />
              <Input label="Merchant Country" value={formData.merchantCountry} onChange={(v) => setFormData({...formData, merchantCountry: v})} />
              <Input label="Customer Country" value={formData.customerCountry} onChange={(v) => setFormData({...formData, customerCountry: v})} />
              <Input label="Device ID" value={formData.deviceId} onChange={(v) => setFormData({...formData, deviceId: v})} />
              <Input label="IP Address" value={formData.ipAddress} onChange={(v) => setFormData({...formData, ipAddress: v})} />
              <Input label="Channel" value={formData.channel} onChange={(v) => setFormData({...formData, channel: v})} />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCcw className="animate-spin" /> : <Send size={18} />}
              Inject Transaction
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 bg-brand-primary/5 border-brand-primary/20 h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Beaker className="text-brand-primary" size={20} />
              Engine Response
            </h3>
            
            {!result ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-white/5 rounded-2xl">
                <Info className="text-gray-600 mb-4" size={48} />
                <p className="text-gray-500 text-sm italic text-left">No transaction injected yet. Use the form to start testing.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className={`p-4 rounded-2xl border flex flex-col items-center text-center ${
                  result.fraud ? "bg-brand-accent/10 border-brand-accent/20" : "bg-green-500/10 border-green-500/20"
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    result.fraud ? "bg-brand-accent/20 text-brand-accent" : "bg-green-500/20 text-green-400"
                  }`}>
                    {result.fraud ? <ShieldAlert size={28} /> : <CheckCircle size={28} />}
                  </div>
                  <h4 className="text-xl font-bold text-white uppercase tracking-wider">
                    {result.fraud ? "Fraud Blocked" : "Transaction Allowed"}
                  </h4>
                  <p className={`text-sm font-bold mt-1 ${result.fraud ? "text-brand-accent" : "text-green-400"}`}>
                    Score: {result.riskScore}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Engine Decision</p>
                    <p className="text-sm font-mono text-white bg-white/5 p-2 rounded-lg">{result.action}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Risk Reasons</p>
                    <p className="text-xs text-gray-400 italic leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                      {result.reason || "No rules triggered."}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0b0f19] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-colors shadow-inner"
      />
    </div>
  );
}

export default SimulatorLab;
