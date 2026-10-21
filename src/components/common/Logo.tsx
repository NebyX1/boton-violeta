import { cn } from '@/lib/cn';

/** Marca gráfica de Botón Violeta. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex items-center justify-center w-[35px] h-[35px] rounded-[11px] bg-brand text-white',
        className,
      )}
    >
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="w-[22px] h-[22px]">
        <path
          d="m6 10 10 17L26 10M11 7l5 9 5-9"
          stroke="currentColor"
          strokeWidth="3.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** Logo completo con bajada institucional. */
export function Logo({ central = false }: { central?: boolean }) {
  return (
    <div className="flex items-center gap-[10px]">
      <span className="flex items-center justify-center w-[40px] h-[40px] rounded-[13px] bg-brand text-white shadow-[0_6px_15px_#7746d823]">
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className="w-7 h-7">
          <path
            d="m6 10 10 17L26 10M11 7l5 9 5-9"
            stroke="currentColor"
            strokeWidth="3.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="font-display text-[19px] font-extrabold tracking-[-0.9px] leading-none">
        botón violeta
        <small className="block font-sans text-[8px] font-[650] tracking-[2.2px] mt-2 text-muted">
          {central ? 'COORDINACIÓN' : 'UNA RED QUE TE CUIDA'}
        </small>
      </div>
    </div>
  );
}
