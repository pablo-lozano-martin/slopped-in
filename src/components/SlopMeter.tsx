// ABOUTME: Slop-meter component for selecting post style level
// ABOUTME: Slider from 1 (academic) to 5 (clickbait) to control generation style

"use client";

interface SlopMeterProps {
  value: number;
  onChange: (value: number) => void;
  onHover?: (text: string | null) => void;
  disabled?: boolean;
}

export default function SlopMeter({ value, onChange, onHover, disabled }: SlopMeterProps) {
  const labels = ["Academic", "Balanced", "Engaging", "Catchy", "Viral"];

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-black uppercase tracking-wider">Style</span>
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider border border-black px-1 bg-white">{labels[value - 1]}</span>
      </div>
      <div className="relative h-10 flex items-center">
        <input
          type="range"
          min="1"
          max="5"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          onMouseEnter={() => onHover?.("ADJUST SLOP LEVEL (1-5)")}
          onMouseLeave={() => onHover?.(null)}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 border border-black appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed z-10 relative [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-retro-red [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-black [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-retro-red [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-black [&::-moz-range-thumb]:rounded-none"
        />
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none items-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-0.5 h-4 ${i <= value ? 'bg-retro-red/20' : 'bg-black/10'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
