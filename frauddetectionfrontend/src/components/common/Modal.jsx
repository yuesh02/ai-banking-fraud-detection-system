import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0f19]/80 backdrop-blur-sm p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-secondary" />
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={16} />
            </button>

            <div className="p-6 sm:p-8 overflow-y-auto scrollbar-hide text-gray-200">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Modal;