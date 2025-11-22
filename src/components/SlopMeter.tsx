// ABOUTME: Slop-meter component for selecting post style level
// ABOUTME: Slider from 1 (academic) to 5 (clickbait) to control generation style

"use client";

interface SlopMeterProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export default function SlopMeter({ value, onChange, disabled }: SlopMeterProps) {
  const labels = ["Academic", "Balanced", "Engaging", "Catchy", "Viral"];

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 mt-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">Style:</span>
        <span className="text-sm font-medium text-blue-600">{labels[value - 1]}</span>
      </div>
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
    </div>
  );
}
