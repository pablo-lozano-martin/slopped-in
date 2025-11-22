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
        <span className="text-sm text-black uppercase tracking-wider">Style:</span>
        <span className="text-sm font-bold text-retro-red uppercase tracking-wider border-2 border-black px-2 py-1 bg-white shadow-retro">{labels[value - 1]}</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        disabled={disabled}
        className="w-full h-4 bg-gray-200 border-2 border-black appearance-none cursor-pointer accent-retro-red disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <div className="flex justify-between mt-1 px-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`w-0.5 h-2 ${i <= value ? 'bg-retro-red' : 'bg-black'}`}></div>
        ))}
      </div>
    </div>
  );
}
