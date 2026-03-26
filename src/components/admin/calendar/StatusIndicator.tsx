'use client';

export type DepartureStatus = 'live' | 'sold_out' | 'inactive' | 'none';

interface StatusIndicatorProps {
  status: DepartureStatus;
}

const statusConfig: Record<DepartureStatus, { label: string; className: string } | null> = {
  live: { label: 'Live', className: 'bg-green-100 text-green-800 border-green-300' },
  sold_out: { label: 'Sold Out', className: 'bg-red-100 text-red-800 border-red-300' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600 border-gray-300' },
  none: null,
};

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  const config = statusConfig[status];
  if (!config) return null;

  return (
    <span
      data-testid={`status-${status}`}
      className={`inline-block rounded text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 border leading-none ${config.className}`}
    >
      {config.label}
    </span>
  );
}
