// ABOUTME: Component for selecting AI model size (3B vs 7B)
// ABOUTME: Allows user to choose between different Qwen model variants

"use client";

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  onHover?: (text: string | null) => void;
  disabled?: boolean;
}

export default function ModelSelector({ value, onChange, onHover, disabled }: ModelSelectorProps) {
  const models = [
    { id: "Qwen2.5-3B-Instruct-q4f16_1-MLC", label: "3B (~2GB, Faster)", size: "~2GB", tooltip: "LOAD QWEN 3B (FAST/LIGHT)" },
    { id: "Qwen2.5-7B-Instruct-q4f16_1-MLC", label: "7B (~4GB, Smarter)", size: "~4GB", tooltip: "LOAD QWEN 7B (SMART/HEAVY)" },
  ];

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-bold text-black uppercase tracking-wider">AI Model</label>
        <span className="text-[10px] text-gray-500 uppercase">{value.includes("3B") ? "3B PARAMS" : "7B PARAMS"}</span>
      </div>
      <div className="flex gap-2">
        {models.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => onChange(model.id)}
            onMouseEnter={() => onHover?.(model.tooltip)}
            onMouseLeave={() => onHover?.(null)}
            disabled={disabled}
            className={`flex-1 px-2 py-1.5 border-2 border-black text-xs font-bold uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              value === model.id
                ? "bg-retro-red text-white shadow-retro"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {model.label.split(" ")[0]}
          </button>
        ))}
      </div>
    </div>
  );
}
