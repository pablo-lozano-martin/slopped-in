// ABOUTME: Component for selecting AI model size (3B vs 7B)
// ABOUTME: Allows user to choose between different Qwen model variants

"use client";

import { ChevronDown, Trash2 } from "lucide-react";

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  onHover?: (text: string | null) => void;
  onDeleteCache: () => void;
  disabled?: boolean;
}

export default function ModelSelector({ value, onChange, onHover, onDeleteCache, disabled }: ModelSelectorProps) {
  const models = [
    { id: "Qwen2.5-3B-Instruct-q4f16_1-MLC", label: "Qwen 3B", size: "~2GB", tooltip: "LOAD QWEN 3B (FAST)" },
    { id: "Qwen2.5-7B-Instruct-q4f16_1-MLC", label: "Qwen 7B", size: "~4GB", tooltip: "LOAD QWEN 7B (SMART)" },
    { id: "Llama-3.2-3B-Instruct-q4f16_1-MLC", label: "Llama 3B", size: "~2GB", tooltip: "LOAD LLAMA 3.2 3B" },
  ];

  const handleDeleteClick = () => {
    onDeleteCache();
  };

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold text-black uppercase tracking-wider">AI Model</label>
        <button
          onClick={handleDeleteClick}
          className="text-[10px] font-bold text-gray-400 hover:text-retro-red px-1 uppercase tracking-wider flex items-center gap-1 transition-colors"
          onMouseEnter={() => onHover?.("DELETE CACHED MODELS")}
          onMouseLeave={() => onHover?.(null)}
          title="Clear browser cache"
        >
          <Trash2 className="w-3 h-3" />
          CLEAR CACHE
        </button>
      </div>
      <div className="relative h-10">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full h-full appearance-none border-2 border-black bg-white px-3 pr-8 text-sm font-bold uppercase focus:outline-none cursor-pointer disabled:opacity-50 hover:bg-gray-50 transition-colors"
          onMouseEnter={() => onHover?.("SELECT AI MODEL")}
          onMouseLeave={() => onHover?.(null)}
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.label} ({model.size})
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
