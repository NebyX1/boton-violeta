import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeColor = 'brand' | 'green' | 'red' | 'gray' | 'amber';

const colors: Record<BadgeColor, string> = {
  brand: 'bg-brand-soft text-brand',
  green: 'bg-green-soft text-green',
  red: 'bg-red-soft text-red',
  gray: 'bg-[#f0ecf5] text-[#9686a4] dark:bg-[#453153] dark:text-[#bda5ce]',
  amber: 'bg-amber-soft text-amber',
};

/** Etiqueta de estado compacta. */
export function Badge({
  children,
  color = 'brand',
  live = false,
  className,
}: {
  children: ReactNode;
  color?: BadgeColor;
  live?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] px-[9px] py-[5px] rounded-[25px] text-[9px] font-[750] leading-[1.4] whitespace-nowrap',
        colors[color],
        className,
      )}
    >
      {live && (
        <i className="block w-[6px] h-[6px] rounded-full bg-current animate-pulse-live shadow-[0_0_0_4px_#43877312]" />
      )}
      {children}
    </span>
  );
}

/** Punto de estado. */
export function Dot({ live = false, className }: { live?: boolean; className?: string }) {
  return (
    <i
      className={cn(
        'inline-block w-[6px] h-[6px] rounded-full bg-current shrink-0',
        live && 'animate-pulse-live shadow-[0_0_0_4px_#43877312]',
        className,
      )}
    />
  );
}
