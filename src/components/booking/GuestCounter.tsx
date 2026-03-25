"use client";

interface GuestCounterProps {
  value: number;
  onChange: (count: number) => void;
  min?: number;
  max?: number;
}

export default function GuestCounter({
  value,
  onChange,
  min = 1,
  max = 20,
}: GuestCounterProps) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-[#78716c] mb-2">
        Guests
      </label>
      <div className="flex items-center justify-between border border-[#ebe7e7] rounded-lg px-4 py-3">
        <button
          type="button"
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-full border border-[#ebe7e7] flex items-center justify-center text-[#78716c] hover:bg-[#f5f0ee] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Decrease guests"
        >
          <span className="material-symbols-outlined text-lg">remove</span>
        </button>
        <span className="font-heading font-bold text-lg text-[#1c1b1b]">
          {value}
        </span>
        <button
          type="button"
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-full border border-[#ebe7e7] flex items-center justify-center text-[#78716c] hover:bg-[#f5f0ee] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Increase guests"
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
      </div>
    </div>
  );
}
