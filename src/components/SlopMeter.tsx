// ABOUTME: Slop-meter component for selecting post style level
// ABOUTME: Slider from 1 (academic) to 5 (clickbait) to control generation style

"use client";

interface SlopMeterProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function SlopMeter({ value, onChange, disabled }: SlopMeterProps) {
  const labels = [
    { value: 1, label: "Academic", desc: "Formal & professional" },
    { value: 2, label: "Balanced", desc: "Mix of formal & engaging" },
    { value: 3, label: "Engaging", desc: "Clear & accessible" },
    { value: 4, label: "Catchy", desc: "Attention-grabbing" },
    { value: 5, label: "Viral", desc: "Maximum clickbait" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700">Slop Meter</h3>
        <span className="text-sm text-gray-500">{labels[value - 1].label}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          {labels.map((item) => (
            <div
              key={item.value}
              className={`flex flex-col items-center ${
                value === item.value ? "text-blue-600 font-semibold" : ""
              }`}
            >
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-2">
        {labels[value - 1].desc}
      </p>
    </div>
  );
}
