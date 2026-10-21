import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/common/Icon';

/** Evento de trazabilidad. */
export function Timeline({ events, className }: { events: { time: number; text: string }[]; className?: string }) {
  return (
    <div className={cn('flex flex-col', className)}>
      {events
        .slice()
        .reverse()
        .map((e, i, arr) => (
          <div key={`${e.time}-${i}`} className="flex items-start gap-[10px] relative pb-4 last:pb-0">
            <span className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-brand-soft text-brand shrink-0 z-10">
              <Icon name="check" size="sm" className="w-3 h-3" />
            </span>
            {i < arr.length - 1 && (
              <i className="absolute left-[13px] top-[26px] bottom-0 w-px bg-line" />
            )}
            <div className="flex-1 min-w-0">
              <time className="block text-[9px] text-muted">
                {new Intl.DateTimeFormat('es-UY', { hour: '2-digit', minute: '2-digit', hour12: false }).format(
                  new Date(e.time),
                )}
              </time>
              <strong className="block text-[11px]">{e.text}</strong>
              <p className="text-[9px] text-muted">Evento de demostración</p>
            </div>
          </div>
        ))}
    </div>
  );
}

/** Panel de contenido dentro de un sheet / diálogo. */
export function SheetBody({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}
