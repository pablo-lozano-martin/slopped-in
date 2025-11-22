// ABOUTME: Component for selecting AI model size (3B vs 7B)
// ABOUTME: Allows user to choose between different Qwen model variants

"use client";

interface ModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  disabled?: boolean;
}

export default function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  const models = [
    { id: "Qwen2.5-3B-Instruct-q4f16_1-MLC", label: "3B (~2GB, Faster)", size: "~2GB" },
    { id: "Qwen2.5-7B-Instruct-q4f16_1-MLC", label: "7B (~4GB, Smarter)", size: "~4GB" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <label className="block text-sm font-medium text-black mb-2 uppercase tracking-wider">AI Model:</label>
      <div className="flex gap-3">
        {models.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => onChange(model.id)}
            disabled={disabled}
            className={`flex-1 px-4 py-3 border-2 border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              value === model.id
                ? "bg-retro-red text-white shadow-retro"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div className="font-semibold">{model.label}</div>
            <div className={`text-xs mt-1 ${value === model.id ? "text-white" : "text-gray-500"}`}>{model.size}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
