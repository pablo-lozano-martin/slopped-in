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
        <span className="text-[10px] font-bold text-retro-red uppercase tracking-wider border border-black px-1 bg-white">{labels[value - 1]}</span>
      </div>
      <div className="relative h-6 flex items-center">
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
          className="w-full h-2 bg-gray-200 border border-black appearance-none cursor-pointer accent-retro-red disabled:opacity-50 disabled:cursor-not-allowed z-10 relative"
        />
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`w-0.5 h-full ${i <= value ? 'bg-retro-red/20' : 'bg-black/10'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
