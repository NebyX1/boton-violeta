import { cn } from '@/lib/cn';

/** Indicador inferior del sistema (home indicator / gesto Android). */
export function HomeIndicator({ device }: { device: 'ios' | 'android' }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-paper shrink-0',
        device === 'android' ? 'h-[22px]' : 'h-[18px]',
      )}
    >
      <span
        className={cn(
          'rounded-[5px]',
          device === 'android' ? 'w-20 h-[3px] bg-[#a494b5]' : 'w-[106px] h-1 bg-[#352b3f] dark:bg-[#bda5cf]',
        )}
      />
    </div>
  );
}
