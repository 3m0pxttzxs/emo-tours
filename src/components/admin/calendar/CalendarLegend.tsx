'use client';

const legendItems = [
  { label: 'Active', colorClass: 'bg-[#4CBB17]' },
  { label: 'Sold Out', colorClass: 'bg-red-500' },
  { label: 'Hidden', colorClass: 'bg-gray-400 opacity-60' },
];

export default function CalendarLegend() {
  return (
    <div className="flex items-center gap-6" data-testid="calendar-legend">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.colorClass}`} />
          <span className="text-sm text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
