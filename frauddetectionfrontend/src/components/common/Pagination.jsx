import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
      <div className="text-sm text-gray-400">
        Page <span className="font-semibold text-white">{page + 1}</span> of <span className="font-semibold text-white">{totalPages}</span>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-sm text-gray-300 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/5 transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages - 1}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-lg text-sm text-gray-300 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/5 transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}

export default Pagination;