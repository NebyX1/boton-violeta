import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/common/Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white brand-shadow hover:bg-brand-dark',
  secondary: 'bg-brand-soft text-brand',
  outline: 'bg-paper border border-line',
  ghost: 'text-muted',
  danger: 'bg-red text-white',
  success: 'bg-green text-white',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  small?: boolean;
  block?: boolean;
  icon?: string;
  iconRight?: string;
  children?: ReactNode;
}

/** Botón principal de la app. */
export function Button({
  variant = 'primary',
  small = false,
  block = false,
  icon,
  iconRight,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[14px] font-bold text-[12px] leading-[1.4] min-h-[47px] px-[17px] py-[13px] transition-transform active:scale-[0.98] hover:-translate-y-px',
        small && 'min-h-[35px] px-3 py-2 text-[10px] rounded-[10px]',
        block && 'w-full',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size="sm" />}
      {children}
      {iconRight && <Icon name={iconRight} size="sm" />}
    </button>
  );
}

/** Botón de solo icono (acción secundaria). */
export function IconButton({
  icon,
  label,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex items-center justify-center relative w-[40px] h-[40px] rounded-[13px] border border-line bg-paper shrink-0 hover:bg-brand-soft',
        className,
      )}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  );
}

/** Botón de texto con enlace. */
export function TextButton({
  children,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1 text-[11px] font-bold text-brand py-[6px]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
