'use client';

interface BulkActionBarProps {
  selectedCount: number;
  onHideAll: () => void;
  onActivateAll: () => void;
  onClear: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onHideAll,
  onActivateAll,
  onClear,
}: BulkActionBarProps) {
  return (
    <div
      data-testid="bulk-action-bar"
      className="flex items-center gap-4 rounded-md border border-gray-200 bg-gray-50 px-4 py-2 shadow-sm"
    >
      <span className="text-sm font-medium text-gray-700">
        {selectedCount} {selectedCount === 1 ? 'date' : 'dates'} selected
      </span>

      <button
        data-testid="bulk-hide-all"
        type="button"
        onClick={onHideAll}
        className="rounded-md bg-gray-400 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-500 transition-colors"
      >
        Hide All
      </button>

      <button
        data-testid="bulk-activate-all"
        type="button"
        onClick={onActivateAll}
        className="rounded-md bg-[#4CBB17] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#3da013] transition-colors"
      >
        Activate All
      </button>

      <button
        data-testid="bulk-clear"
        type="button"
        onClick={onClear}
        className="text-sm font-medium text-gray-500 hover:text-gray-700 underline transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
