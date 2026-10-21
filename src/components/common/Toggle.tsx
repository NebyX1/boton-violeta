import { cn } from '@/lib/cn';

/**
 * Interruptor accesible. En React Native equivaldría a un `Switch`.
 */
export function Toggle({
  on,
  onToggle,
  label,
  className,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        'relative w-[42px] h-[24px] rounded-[20px] shrink-0 transition-colors',
        on ? 'bg-brand' : 'bg-[#dcd5e4]',
        className,
      )}
    >
      <i
        className={cn(
          'absolute left-[3px] top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-[0_2px_3px_#0001] transition-transform',
          on && 'translate-x-[18px]',
        )}
      />
    </button>
  );
}
