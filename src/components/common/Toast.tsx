import { Icon } from '@/components/common/Icon';
import { cn } from '@/lib/cn';

/**
 * Aviso transitorio. `pointer-events-none` garantiza que nunca bloquee
 * controles de emergencia o de consentimiento.
 */
export function Toast({ text, variant = 'phone' }: { text: string; variant?: 'phone' | 'global' }) {
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-none z-[1200] flex items-center gap-[9px] px-[15px] py-[13px] rounded-[14px] bg-[#39264e] text-white text-[10px] leading-[1.6] animate-sheetin',
        variant === 'phone' ? 'absolute left-[19px] right-[19px] bottom-[97px]' : 'fixed right-6 bottom-6 max-w-[410px]',
      )}
    >
      <Icon name="check2" size="sm" className="text-[#d5baf3]" />
      <span>{text}</span>
    </div>
  );
}
