import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/common/Icon';

/** Tarjeta contenedora de bloque. */
export function Tile({
  children,
  tinted = false,
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { tinted?: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        'p-[17px] rounded-[20px] border tile-shadow',
        tinted ? 'bg-brand-soft border-transparent' : 'bg-paper border-line',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Fila de menú con icono, título, subtítulo y chevron. */
export function MenuRow({
  icon,
  title,
  sub,
  onClick,
  data,
}: {
  icon: string;
  title: string;
  sub: string;
  onClick: () => void;
  data?: Record<string, string>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-a={data?.action}
      data-screen={data?.screen}
      className="flex items-center gap-[11px] w-full text-left py-[15px] border-b border-line last:border-b-0"
    >
      <span className="flex items-center justify-center w-[31px] h-[31px] rounded-[13px] bg-brand-soft text-brand shrink-0">
        <Icon name={icon} size="sm" />
      </span>
      <span className="flex-1 min-w-0">
        <strong className="block text-[12px]">{title}</strong>
        <small className="block text-muted text-[10px] mt-1 leading-[1.6]">{sub}</small>
      </span>
      <Icon name="chev" size="sm" className="text-muted" />
    </button>
  );
}

/** Fila reutilizable de contenido con icono. */
export function IconRow({
  icon,
  tone = 'brand',
  children,
  className,
}: {
  icon: string;
  tone?: 'brand' | 'green' | 'red' | 'amber' | 'plain';
  children: ReactNode;
  className?: string;
}) {
  const tones = {
    brand: 'bg-brand-soft text-brand',
    green: 'bg-green-soft text-green',
    red: 'bg-red-soft text-red',
    amber: 'bg-amber-soft text-amber',
    plain: 'bg-transparent',
  };
  return (
    <div className={cn('flex items-center gap-[11px] py-[15px] border-b border-line last:border-b-0', className)}>
      <span className={cn('flex items-center justify-center w-[39px] h-[39px] rounded-[13px] shrink-0', tones[tone])}>
        <Icon name={icon} />
      </span>
      {children}
    </div>
  );
}

/** Separador horizontal. */
export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px bg-line my-[19px]', className)} />;
}
