import type { ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Etiqueta de campo de formulario. */
export function FieldLabel({ htmlFor, children, className }: { htmlFor?: string; children: ReactNode; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn('block mt-[19px] mb-2 text-[12px] font-bold', className)}>
      {children}
    </label>
  );
}

/** Texto de ayuda. */
export function Hint({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn('mt-[7px] text-[9px] text-muted leading-[1.6]', className)}>{children}</p>;
}

/** Casilla de verificación con texto. */
export function Checkbox({
  checked,
  onChange,
  children,
  id,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <label className={cn('flex gap-[10px] items-start text-[11px] leading-[1.7]', className)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{children}</span>
    </label>
  );
}

/** Select nativo estilizado. */
export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn('bg-paper border border-line rounded-[13px] text-[12px]', className)} {...rest}>
      {children}
    </select>
  );
}
