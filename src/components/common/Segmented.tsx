import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: string;
}

/** Control segmentado (equivalente a un `Picker` segmentado en iOS). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn('flex p-1 gap-[3px] bg-[#eee9f4] rounded-[13px]', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'flex-1 px-[10px] py-[9px] rounded-[10px] text-[11px] font-[650] whitespace-nowrap',
            value === o.value ? 'bg-paper text-brand shadow-[0_3px_9px_#42325a0a]' : '',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Fila de filtros desplazable. */
export function Chips({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex gap-[7px] overflow-x-auto no-scrollbar', className)}>{children}</div>;
}

/** Chip de filtro. */
export function Chip({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-[5px] px-3 py-2 rounded-[25px] border text-[10px] font-[650] whitespace-nowrap',
        active
          ? 'border-[#ceb7ee] bg-brand-soft text-brand'
          : 'border-line bg-paper',
      )}
    >
      {label}
    </button>
  );
}
