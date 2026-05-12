import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ListFilter } from "lucide-react";

import TransactionTable from "../components/transactions/TransactionTable";
import Pagination from "../components/common/Pagination";
import TransactionFilter from "../components/transactions/TransactionFilter";

import {
  getTransactions,
  searchTransactions
} from "../services/transactionService";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions(page);
  }, [page, filters]);

  const fetchTransactions = async (currentPage) => {
    setLoading(true);
    try {
      let data;
      const hasFilters = Object.values(filters).some(value => value);

      if (hasFilters) {
        data = await searchTransactions({
          ...filters,
          page: currentPage,
          size: 10
        });
      } else {
        data = await getTransactions(currentPage, 10);
      }

      setTransactions(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Transaction fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-['Outfit'] mb-1">
            Transactions
          </h1>
          <p className="text-gray-400 text-sm">Monitor and search through payment activities.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors">
          <ListFilter size={16} />
          Export Data
        </button>
      </div>

      <div className="glass-card p-6">
        <TransactionFilter onFilterChange={handleFilterChange} />
        
        <div className={`transition-opacity duration-300 ${loading ? "opacity-50" : "opacity-100"}`}>
          <TransactionTable data={transactions} />
        </div>
        
        <div className="mt-6 border-t border-white/10 pt-6">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default Transactions;