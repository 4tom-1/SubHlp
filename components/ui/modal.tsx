import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-2xl sm:max-w-3xl mx-2 my-4 sm:mx-6 sm:my-10"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 text-xl z-10 shadow"
          onClick={onClose}
          aria-label="閉じる"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="max-h-[80vh] overflow-y-auto mt-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 