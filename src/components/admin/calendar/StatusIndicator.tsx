'use client';

interface StatusIndicatorProps {
  status: 'active' | 'sold_out' | 'hidden' | 'none';
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  if (status === 'none') return null;

  const colorClass =
    status === 'active'
      ? 'bg-[#4CBB17]'
      : status === 'sold_out'
        ? 'bg-red-500'
        : 'bg-gray-400 opacity-60';

  return (
    <span
      data-testid={`status-${status}`}
      className={`inline-block h-2.5 w-2.5 rounded-full ${colorClass}`}
      aria-label={status.replace('_', ' ')}
    />
  );
}
