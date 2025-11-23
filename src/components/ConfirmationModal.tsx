import { X, AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center z-[60] transition-all duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className={`w-full max-w-md border-2 border-black bg-white shadow-retro relative flex flex-col transition-all duration-300 transform ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black p-2 bg-retro-red text-white">
          <h2 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-0.5 hover:bg-black hover:text-white border-2 border-transparent transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 font-mono flex flex-col gap-4">
          <p className="text-sm font-bold">{message}</p>
          
          <div className="flex gap-4 mt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2 border-2 border-black hover:bg-gray-100 font-bold uppercase text-xs shadow-retro active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 border-2 border-black bg-retro-red text-white hover:bg-red-600 font-bold uppercase text-xs shadow-retro active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
