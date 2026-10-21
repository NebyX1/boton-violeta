import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/common/Icon';

export type NoteColor = 'brand' | 'gray' | 'green' | 'red' | 'amber';

const colors: Record<NoteColor, string> = {
  brand: 'bg-brand-soft text-[#8c69b3]',
  gray: 'bg-canvas text-muted',
  green: 'bg-green-soft text-green',
  red: 'bg-red-soft text-[#ae5070]',
  amber: 'bg-[#fff5e1] text-[#967338] dark:bg-[#4a3a22] dark:text-[#d9b984]',
};

/** Aviso informativo contextual. */
export function Note({
  children,
  icon = 'info',
  color = 'brand',
  className,
}: {
  children: ReactNode;
  icon?: string;
  color?: NoteColor;
  className?: string;
}) {
  return (
    <div className={cn('flex gap-[9px] px-[14px] py-[13px] rounded-[14px] text-[10px] leading-[1.7]', colors[color], className)}>
      <Icon name={icon} size="sm" className="mt-px" />
      <div>{children}</div>
    </div>
  );
}
