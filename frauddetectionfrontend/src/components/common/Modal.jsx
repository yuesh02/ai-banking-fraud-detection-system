import { useEffect } from "react";

function Modal({ isOpen, onClose, children }) {

  // ESC key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-white/40 backdrop-blur-md
        transition-all duration-300
      "
    >

      {/* Modal Box */}
      <div
        className="
          w-full max-w-2xl
          bg-white rounded-2xl
          shadow-2xl
          overflow-hidden
          animate-modalIn
          max-h-[85vh]
          flex flex-col
        "
      >

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">

          <h2 className="text-sm font-semibold text-gray-700">
            Details
          </h2>

          <button
            onClick={onClose}
            className="
              w-8 h-8 flex items-center justify-center
              rounded-full
              bg-gray-100 hover:bg-gray-200
              text-gray-600 hover:text-black
              transition
            "
          >
            ✕
          </button>

        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Modal;