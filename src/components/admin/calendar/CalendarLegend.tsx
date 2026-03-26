'use client';

const legendItems = [
  { label: 'Live', className: 'bg-green-100 text-green-800 border-green-300' },
  { label: 'Sold Out', className: 'bg-red-100 text-red-800 border-red-300' },
  { label: 'Inactive', className: 'bg-gray-100 text-gray-600 border-gray-300' },
];

export default function CalendarLegend() {
  return (
    <div className="flex items-center gap-3" data-testid="calendar-legend">
      {legendItems.map((item) => (
        <span
          key={item.label}
          className={`inline-block rounded text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 border leading-none ${item.className}`}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}
