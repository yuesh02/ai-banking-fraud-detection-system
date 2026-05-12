import { useState } from "react";
import { Filter, RotateCcw } from "lucide-react";

function TransactionFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    uuid: "",
    customerId: "",
    merchantId: "",
    accountId: "",
    startDate: "",
    endDate: "",
    riskLevel: "",
    fraud: "",
  });

  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleReset = () => {
    const empty = {
      uuid: "",
      customerId: "",
      merchantId: "",
      accountId: "",
      startDate: "",
      endDate: "",
      riskLevel: "",
      fraud: "",
    };
    setFilters(empty);
    onFilterChange(empty);
  };

  return (
    <div className="bg-[#1e293b]/50 border border-white/10 p-4 rounded-xl mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={16} className="text-brand-primary" />
        <h3 className="font-semibold text-white text-sm uppercase tracking-wider">Search & Filters</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">UUID</label>
          <input
            type="text"
            placeholder="Search UUID..."
            value={filters.uuid}
            onChange={(e) => handleChange("uuid", e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 p-2.5 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-brand-primary/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Customer Name</label>
          <input
            type="text"
            placeholder="Search Name..."
            value={filters.customerId}
            onChange={(e) => handleChange("customerId", e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 p-2.5 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-brand-primary/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Merchant Name</label>
          <input
            type="text"
            placeholder="Search Merchant Name..."
            value={filters.merchantId}
            onChange={(e) => handleChange("merchantId", e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 p-2.5 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-brand-primary/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Account ID</label>
          <input
            type="text"
            placeholder="Search Account..."
            value={filters.accountId}
            onChange={(e) => handleChange("accountId", e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 p-2.5 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-brand-primary/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 p-2.5 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-brand-primary/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 p-2.5 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-brand-primary/50 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Risk Level</label>
          <select
            value={filters.riskLevel}
            onChange={(e) => handleChange("riskLevel", e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 p-2.5 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-brand-primary/50 transition-colors appearance-none"
          >
            <option value="">All Risk Levels</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Fraud Status</label>
          <select
            value={filters.fraud}
            onChange={(e) => handleChange("fraud", e.target.value)}
            className="w-full bg-[#0f172a] border border-white/10 p-2.5 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-brand-primary/50 transition-colors appearance-none"
          >
            <option value="">All Statuses</option>
            <option value="true">Fraud</option>
            <option value="false">Safe</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-lg transition-colors border border-white/5"
        >
          <RotateCcw size={14} />
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default TransactionFilter;