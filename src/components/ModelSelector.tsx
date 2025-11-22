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
      <label className="block text-sm font-medium text-gray-700 mb-2">AI Model:</label>
      <div className="flex gap-3">
        {models.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => onChange(model.id)}
            disabled={disabled}
            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              value === model.id
                ? "border-blue-600 bg-blue-50 text-blue-900"
                : "border-gray-300 hover:border-blue-400"
            }`}
          >
            <div className="font-semibold">{model.label}</div>
            <div className="text-xs text-gray-500 mt-1">{model.size}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
