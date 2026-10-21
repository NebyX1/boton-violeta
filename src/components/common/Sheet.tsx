import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { IconButton } from '@/components/common/Button';

/**
 * Hoja inferior / diálogo modal.
 * - `variant="phone"` se renderiza dentro del simulador (barra inferior).
 * - `variant="global"` se renderiza en la capa global (consola o pantallas sin teléfono).
 */
export function Sheet({
  title,
  onClose,
  children,
  actions,
  variant = 'phone',
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  variant?: 'phone' | 'global';
}) {
  const ref = useRef<HTMLDivElement>(null);

  /* Escape cierra; el foco queda atrapado dentro del diálogo. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !ref.current) return;
      const f = ref.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]),input,select,textarea,a[href],[tabindex="0"]',
      );
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => ref.current?.querySelector('button')?.focus({ preventScroll: true }), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [onClose]);

  return (
    <section
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={cn(
        'w-full bg-paper animate-sheetin overflow-auto',
        variant === 'phone'
          ? 'max-h-[94%] rounded-t-[27px] px-[22px] pt-[10px] pb-7'
          : 'max-w-[478px] max-h-[91dvh] rounded-[24px] p-[23px]',
      )}
    >
      {variant === 'phone' && <div className="w-9 h-1 rounded-[5px] bg-[#ded1e9] mx-auto mb-[18px]" />}
      <header className="flex items-center justify-between gap-[10px] mb-[18px]">
        <h2 className="text-[20px]">{title}</h2>
        <IconButton icon="close" label="Cerrar diálogo" onClick={onClose} className="w-[31px] h-[31px] rounded-[10px]" />
      </header>
      {children}
      {actions && <div className="flex flex-col gap-2 mt-[22px]">{actions}</div>}
    </section>
  );
}

/** Superficie del diálogo dentro del teléfono simulado. */
export function PhoneOverlay({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-[900] bg-[#2b143f65] backdrop-blur-[4px] flex items-end">
      {children}
    </div>
  );
}

/** Superficie del diálogo global (consola / pantalla completa). */
export function GlobalOverlay({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[2000] bg-[#28143f65] backdrop-blur-[5px] flex items-center justify-center p-6">
      {children}
    </div>
  );
}
