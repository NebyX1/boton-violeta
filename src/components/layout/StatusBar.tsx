import { Icon } from '@/components/common/Icon';
import { cn } from '@/lib/cn';

/** Barra de estado del sistema simulado (hora fija 9:41). */
export function StatusBar({ device, online }: { device: 'ios' | 'android'; online: boolean }) {
  return (
    <div className="relative flex items-center justify-between h-[38px] px-[22px] pt-2 pb-1 text-[11px] font-[750] shrink-0">
      <span>9:41</span>
      <i
        className={cn(
          'absolute left-1/2 -translate-x-1/2 bg-[#2a2330]',
          device === 'android' ? 'w-[9px] h-[9px] top-[13px]' : 'w-24 h-[23px] top-[5px] rounded-[20px]',
        )}
      />
      <span className="flex items-center gap-1">
        <Icon name="signal" className="w-[14px] h-[14px] [stroke-width:2]" />
        <Icon name={online ? 'wifi' : 'offline'} className="w-[14px] h-[14px] [stroke-width:2]" />
        <Icon name="battery" className="w-[14px] h-[14px] [stroke-width:2]" />
      </span>
    </div>
  );
}
